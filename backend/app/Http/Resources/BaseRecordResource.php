<?php

namespace App\Http\Resources;

use App\Enums\BaseRecordsEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseRecordResource extends JsonResource
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
            'type' => $this->type,
            'type_title' => BaseRecordsEnum::getLabel($this->type),
            'title' => $this->title,
            'course' => $this->course,
            'semester' => $this->semester,
        ];
    }
}
