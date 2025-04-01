<?php

namespace App\Services;

use App\Helpers\Filter;
use BadMethodCallException;
use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class FiltersService
{
    public Collection $filters;
    private bool $sortable = true;
    private array $specialFields;
    private array $specialFilterAsConventional;
    private array $loadedRelationships = [];
    private array $filteredFields = [];
    private string $currentField;
    private ?string $databasePrefix = null;

    private QueryBuilder|EloquentBuilder $builder;
    private $sortingAscending;
    private $sortingField;
    private $filterFields;

    /**
     *
     * @param EloquentBuilder|QueryBuilder $builder
     * @param $criteria
     * @return QueryBuilder|EloquentBuilder
     */
    public function applyCriteria(EloquentBuilder|QueryBuilder $builder, $criteria): EloquentBuilder|QueryBuilder
    {
        $this->builder = $builder;
        $this->init($criteria);
        $this->makeFilters();
        $this->handleFields($criteria);

        return $this->builder;
    }

    /**
     * @param $criteria
     */
    private function init($criteria): void
    {
        $this->initFilters();

        $this->sortingField = Arr::get($criteria, 'sortField', 'id');
        $this->sortingAscending = $this->isSortingAscending($criteria);

        $this->filterFields = Arr::get($criteria, 'filterFields', '{[]}');

        if ($this->sortable) {
            $this->builder->orderBy(
                $this->sortingField,
                $this->getSortingDir()
            );
        }
    }

    private function initFilters(): void
    {
        if (!isset($this->filters)) {
            $this->filters = new Collection();
        }
    }

    private function isSortingAscending($criteria)
    {
        if ($sorting = Arr::get($criteria, 'isSortAscending')) {
            return $sorting;
        }

        if ($sorting = Arr::get($criteria, 'sortDir')) {
            return strtolower($sorting) === 'asc';
        }

        return false;
    }

    private function makeFilters(): void
    {
        $filtersParsed = is_array($this->filterFields) ? $this->filterFields : json_decode($this->filterFields) ?? [];
        $filtersParsed = array_map(fn($filter) => new Filter($filter), $filtersParsed);

        $this->addFilter($filtersParsed);
    }

    /**
     * Executa os filtros de fato
     *
     * @param $criteria
     * @return void
     */
    private function handleFields($criteria): void
    {
        $groupFilters = $this->getGroupFilters();

        foreach ($groupFilters as $filterField => $filters) {
            $this->currentField = $filterField;

            $this->handleFilter($filters);
        }

        $this->handleSpecialFilterAsConventional();
    }

    private function handleSpecialFilterAsConventional(): void
    {
        foreach ($this->specialFilterAsConventional ?? [] as $filterField => $filters) {
            $this->currentField = $filterField;
            $this->applyFiltersConvetional($filters);
        }
    }

    /**
     * @return Collection
     */
    private function getGroupFilters(): Collection
    {
        return $this->filters->groupBy(fn(Filter $filter) => $filter->getName());
    }

    /**
     *
     * @param Collection $filters
     */
    private function handleFilter(Collection $filters): void
    {
        // fica separado porque o special fields não entra no agrupamento de where padrão
        [$specialFilters, $normalFilters] = $filters->partition(function (Filter $filter) {
            return $this->isSpecialFilter($filter);
        });

        foreach ($specialFilters as $specialFilter) {
            $this->executeSpecialFilter($specialFilter);
        }

        // filtros que possuem uso de local scope precisam ser executados no builder base
        [$scopeFilters, $othersFilters] = $normalFilters->partition(function (Filter $filter) {
            return $filter->getScope() !== null;
        });

        foreach ($scopeFilters as $filter) {
            $this->applyByType($this->builder, $filter);
        }

        // restante dos filtros podem ser executados normalmente
        $this->applyFiltersConvetional($othersFilters);
    }

    private function applyFiltersConvetional($filters): void
    {
        $this->builder->where(function (
            QueryBuilder|EloquentBuilder $builder,
        ) use ($filters) {
            foreach ($filters as $filter) {
                $this->applyByType($builder, $filter);
            }
        });
    }

    public function addSpecialFilterAsConventional(mixed $filter): void
    {
        $this->specialFilterAsConventional[$filter->getField()][] = $filter;
    }

    private function isSpecialFilter(mixed $filter): bool
    {
        return isset($this->specialFields[$filter->getField()]);
    }

    private function executeSpecialFilter(mixed $filter): void
    {
        $this->specialFields[$filter->getField()]($this->builder, $filter);
    }

    private function applyByType(
        QueryBuilder|EloquentBuilder $builder,
        Filter                       $filter,
    ): QueryBuilder|EloquentBuilder
    {
        if ($filter->getRelation() !== null) {
            $relationClause = $this->getClause($filter, true);
            return $builder->{$relationClause}($filter->getRelation(), function ($query) use ($filter) {
                $this->applyFilter($query, $filter);
            });
        } elseif ($filter->getScope() !== null) {
            return $this->applyFilter($this->builder->callDynamic($filter->getScope()), $filter);
        }

        return $this->applyFilter($builder, $filter);
    }

    public function applyFilter($builder, $filter)
    {
        $clause = $this->getClause($filter);

        return match (strtolower($filter->getServerType())) {
            'in', 'between' => $builder->{$clause}($filter->getName($this->databasePrefix), $filter->getValue()),
            'equals', 'unique' => $builder->{$clause}(
                $filter->getName($this->databasePrefix),
                '=',
                $filter->getValue(),
            ),
            'like', 'having-like' => $builder->{$clause}(
                $filter->getName($this->databasePrefix),
                'like',
                "%{$filter->getRawValue()}%",
            ),
            'having' => $builder->{$clause}($filter->getName($this->databasePrefix), 'like', $filter->getValue()),
            'custom' => $builder->{$clause}(
                $filter->getName($this->databasePrefix),
                $filter->getOperator(),
                $filter->getValue(),
            ),
            'diff' => $builder->{$clause}(
                $filter->getName($this->databasePrefix),
                '<>',
                $filter->getValue(),
            ),
            'date' => $builder->{$clause}(
                $filter->getName($this->databasePrefix),
                [trim($filter->getRawValue()) . ' 00:00:00', trim($filter->getRawValue()) . ' 23:59:59']
            ),
        };
    }

    public function getClause(Filter $filter, $isRelationClause = false): string
    {
        $currentField = "{$filter->getName()}-{$filter->getScope()}-{$filter->getRelation()}";
        $filteredField = in_array($currentField, $this->filteredFields);
        $clause = match (strtolower($filter->getServerType())) {
            'in' => $filteredField ? 'orWhereIn' : 'whereIn',
            'having', 'having-like' => $filteredField && $filter->getRelation() === null ? 'orHaving' : 'having',
            'date', 'between' => $filteredField ? 'orWhereBetween' : 'whereBetween',
            default => ($filteredField && $filter->getRelation() === null)
                ? 'orWhere'
                : 'where'
        };

        if ($isRelationClause) {
            $clause = $filteredField ? 'orWhereHas' : 'whereHas';
        } else {
            $this->filteredFields[] = $currentField;
        }

        return $clause;
    }

    /**
     * @param bool $sortable
     */
    public function setSortable(bool $sortable): void
    {
        $this->sortable = $sortable;
    }

    /**
     * Filtra de forma customizada
     */
    public function addSpecialField($field, Closure $closure): void
    {
        $this->specialFields[$field] = $closure;
    }

    /**
     * @param string|null $databasePrefix
     */
    public function setDatabasePrefix(?string $databasePrefix): void
    {
        $this->databasePrefix = $databasePrefix;
    }

    public function addFilter($filters): void
    {
        $this->initFilters();

        if (
            is_array($filters) &&
            !collect($filters)->every(function ($filter) {
                return $filter instanceof Filter;
            })
        ) {
            throw new BadMethodCallException('All items from param $filters must be ' . Filter::class);
        } elseif (!is_array($filters) && !($filters instanceof Filter)) {
            throw new BadMethodCallException('Param $filters must be ' . Filter::class);
        } elseif (!is_array($filters) && $filters instanceof Filter) {
            $filters = [$filters];
        }

        $this->filters = $this->filters->merge($filters);
    }

    public function getSortingAscending()
    {
        return $this->sortingAscending;
    }

    public function getSortingField()
    {
        return $this->sortingField;
    }

    public function getSortingDir(): string
    {
        return in_array($this->sortingAscending, ['true', true, 'asc'], true) ? 'ASC' : 'DESC';
    }
}