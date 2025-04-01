<?php

namespace App\Http\Resources\Contracts;

use Illuminate\Http\Resources\Json\JsonResource;

class ContractDataResource extends JsonResource
{
    public function toArray($request)
    {
        return array_merge(parent::toArray($request), [
            'address' => $this->resource['job']->company->address,
            'role' => $this->resource['job']->role->title,
            'company_id' => $this->resource['job']->company->id,
            'working_day' => $this->resource['job']->workingDay
        ]);
    }
}