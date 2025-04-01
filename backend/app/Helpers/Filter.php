<?php

namespace App\Helpers;

use BackedEnum;

class Filter
{
    const DEFAULT_SERVER_TYPE = 'like';

    private string $field;
    private mixed $value;
    private mixed $key;

    private ?string $alias;
    private ?string $label;
    private ?string $serverType;
    private ?string $relation;
    private ?string $scope;
    private ?string $operator;
    private ?bool $withoutDatabasePrefix;

    public function __construct($filter)
    {
        if (is_array($filter)) {
            $filter = (object)$filter;
        }

        $this->field = $filter->field;
        $this->value = $filter->value;
        $this->key = $filter->key ?? null;
        $this->alias = $filter->alias ?? null;
        $this->label = $filter->label ?? null;
        $this->serverType = $filter->serverType ?? null;
        $this->relation = $filter->relation ?? null;
        $this->scope = $filter->scope ?? null;
        $this->operator = $filter->operator ?? null;
        $this->withoutDatabasePrefix = $filter->withoutDatabasePrefix ?? false;
    }

    /**
     * @return string|null
     */
    public function getScope(): ?string
    {
        return $this->scope;
    }

    /**
     * @return string
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * @return mixed
     */
    public function getValue(): mixed
    {
        return $this->value;
    }

    /**
     * @return mixed
     */
    public function getRawValue(): mixed
    {
        if ($this->value instanceof BackedEnum) {
            return $this->value->value;
        }

        return $this->getValue();
    }

    /**
     * @return mixed
     */
    public function getKey(): mixed
    {
        return $this->key;
    }

    /**
     * @param string $serverType
     * @return Filter
     */
    public function setServerType(string $serverType): Filter
    {
        $this->serverType = $serverType;
        return $this;
    }

    public function setValue($value): static
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return bool
     */
    public function getBooleanValue(): bool
    {
        return (bool)$this->value;
    }

    /**
     * @return string
     */
    public function getName($databasePrefix = null)
    {
        $prefix = '';
        if ($databasePrefix && !$this->withoutDatabasePrefix) {
            $prefix = "$databasePrefix.";
        }

        return $prefix . ($this->getAlias() ?? $this->getField());
    }

    /**
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @return ?string
     */
    public function getAlias(): ?string
    {
        return $this->alias;
    }

    /**
     * @return string
     */
    public function getServerType(): string
    {
        return $this->serverType ?? static::DEFAULT_SERVER_TYPE;
    }

    /**
     * @return string|null
     */
    public function getRelation(): ?string
    {
        return $this->relation;
    }

    /**
     * @param string $field
     */
    public function setField(string $field): void
    {
        $this->field = $field;
    }

    /**
     * @return string|null
     */
    public function getOperator(): ?string
    {
        return $this->operator;
    }

    /**
     * @param string|null $operator
     * @return Filter
     */
    public function setOperator(?string $operator): Filter
    {
        $this->operator = $operator;
        return $this;
    }
}
