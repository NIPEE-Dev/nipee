<?php

namespace App\Http\Resources\Activities;

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
        return [
            "id" => $this->id,
            "title" => $this->title,
            "estimatedTime" => $this->estimated_time,
            "activityDate" => $this->activity_date,
            "description" => $this->description,
            "status" => $this->status,
            'justification' => $this->justification,
        ];
    }
}
