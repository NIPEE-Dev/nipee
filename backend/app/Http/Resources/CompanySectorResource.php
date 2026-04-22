<?php

namespace App\Http\Resources;

use App\Enums\ActiveEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanySectorResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'branch_id' => $this->branch_id,
            'name' => $this->name,
            'email' => $this->email,
            'candidatesCount' => $this->contracts()->where('status', ActiveEnum::ACTIVE->value)->count(),
        ];
    }
}
