<?php

namespace App\Http\Resources;

use App\Enums\CandidateStatusEnum;
use App\Enums\JobCandidateStatusEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class JobCandidateResource extends JsonResource
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
            'name' => $this->name,
            'gender' => $this->gender,
            'course' => $this->userCourse,
            'location' => $this->address->uf ?? '',
            'council' => $this->address->city ?? '',
            'phone' => $this->contact->phone ?? '',
            'statusLabel' => CandidateStatusEnum::getLabel(''.$this->pivot->status),
            'status' => (int) $this->pivot->status,
            'resume' => $this->resume,
        ];
    }
}
