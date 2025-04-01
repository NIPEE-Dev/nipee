<?php

namespace App\Services;

use App\Enums\BaseRecordsEnum;
use App\Models\Shared\BaseRecord;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class BaseRecordService
{
    use Filterable;

    public function index($criteria)
    {
        $builder = BaseRecord::query();
        $this->applyFromQuery($builder, $criteria);
        return $this->applyCriteria($builder, $criteria)->paginate(Arr::get($criteria, 'perPage', 10));
    }

    private function applyFromQuery(Builder $builder, $criteria)
    {
        if ($type = BaseRecordsEnum::tryFrom(Arr::get($criteria, 'type'))) {
            $builder->where('type', '=', $type);
        }
    }
}