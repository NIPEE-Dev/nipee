<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'company' => $this->company->corporate_name,
            'appliedAt' => $this->candidates[0]->pivot->created_at ?? null,
            'status' => $this->candidates[0]->pivot->status,
        ];
    }
}
