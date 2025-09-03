<?php

namespace App\Http\Resources;

use App\Enums\GenderEnum;
use App\Enums\InterestEnum;
use App\Enums\PeriodEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    public function toArray($request)
    {
        return array_merge(parent::toArray($request), [
            'gender_title' => GenderEnum::getLabel($this->gender),
            'period_title' => PeriodEnum::getLabel($this->period),
            'interest_title' => InterestEnum::getLabel($this->interest),
            'school_id' => $this->user->school[0]->id ?? null,
            'course_title' => $this->userCourse->title ?? null,
            'interviews' => JobCandidateResource::collection($this->interviews),
        ]);
    }
}
