<?php

namespace App\Http\Resources\Activities;

use App\Enums\Activities\ActivityStatusEnum;
use App\Enums\RolesEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $roles = [RolesEnum::COMPANY->value, RolesEnum::SCHOOL->value, RolesEnum::GENERAL_ADMIN->value];
        $roleId = $request->user()->roles[0]->id;
        return [
            "id" => $this->id,
            "title" => $this->title,
            "estimatedTime" => $this->estimated_time,
            "activityDate" => $this->activity_date,
            "description" => $this->description,
            "status" => ActivityStatusEnum::parseStatus($this->status),
            "candidateName" => $this->when(in_array($roleId, $roles), $this->user->name),
            'justification' => $this->justification,
            'justificated_at' => $this->justificated_at
        ];
    }
}
