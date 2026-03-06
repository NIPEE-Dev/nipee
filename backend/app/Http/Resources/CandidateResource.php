<?php

namespace App\Http\Resources;

use App\Enums\GenderEnum;
use App\Enums\InterestEnum;
use App\Enums\JobCandidateStatusEnum;
use App\Enums\PeriodEnum;
use App\Enums\UserCandidateStatusEnum;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class CandidateResource extends JsonResource
{
    public function toArray($request)
    {
        $situations = [];
        $candidateId = $this->id;
        for ($i = 0; $i < count($this->jobs); $i++) {
            $current = $this->jobs[$i];
            $jobCandidate = $current->candidates->where('id', $candidateId)->first();
            $statusName = JobCandidateStatusEnum::getLabel($jobCandidate->pivot->status . '');
            $situations[$statusName][] = ['company' => $current->company->corporate_name, 'jobId' => $current->id, 'role' => $current->role];
        }

        return array_merge(parent::toArray($request), [
            'gender_title' => GenderEnum::getLabel($this->gender),
            'period_title' => PeriodEnum::getLabel($this->period),
            'interest_title' => InterestEnum::getLabel($this->interest),
            'school_id' => $this->user->school[0]->id ?? null,
            'course_title' => $this->userCourse->title ?? null,
            'jobs_situations' => $situations,
            'status' => UserCandidateStatusEnum::getLabel($this->status)
        ]);
    }
}
