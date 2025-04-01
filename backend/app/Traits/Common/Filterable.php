<?php

namespace App\Traits\Common;

use App\Helpers\Filter;
use App\Services\FiltersService;
use BadMethodCallException;
use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

trait Filterable
{
    private FiltersService $filtersService;

    public function __call(string $name, array $arguments)
    {
        $this->bootFilters();

        if(method_exists($this->filtersService, $name)){
            return $this->filtersService->$name(...$arguments);
        }
    }

    public function bootFilters(): void
    {
        if(!isset($this->filtersService)){
            $this->filtersService = resolve(FiltersService::class);
        }
    }
}
