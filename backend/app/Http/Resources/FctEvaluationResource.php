<?php

namespace App\Http\Resources;

use App\Enums\FctEvaluationStatusEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class FctEvaluationResource extends JsonResource
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
            'candidate' => $this->candidate->name,
            'school' => $this->school->corporate_name,
            'company' => [
                'name' => $this->company->name,
                'responsible' => $this->company->supervisor,
            ],
            'role' => $this->job->role,
            'status' => $this->status,
            'statusEnum' => FctEvaluationStatusEnum::getLabel($this->status),
            'createdAt' => $this->created_at,
        ];
    }
}
