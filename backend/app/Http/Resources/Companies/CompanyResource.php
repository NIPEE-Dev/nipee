<?php

namespace App\Http\Resources\Companies;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray($request)
    {
        return array_merge(parent::toArray($request), [
            'address' => $this->address
        ]);
    }
}
