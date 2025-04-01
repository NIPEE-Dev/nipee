<?php

namespace App\Http\Resources\Jobs;

use Illuminate\Http\Resources\Json\JsonResource;

class JobWorkingDayResource extends JsonResource
{
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}