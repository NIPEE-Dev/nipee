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
        $resume = $this->resume;

        if (is_null($resume)) {
            $resumeDoc = $this->documents->whereIn('type', ['Currículo (CV)', 'Curriculum Vitae'])->first();
            $resume = $resumeDoc ? $resumeDoc->filename . ".$resumeDoc->file_extension" : null;
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'gender' => $this->gender,
            'course' => $this->userCourse,
            'location' => $this->address->uf ?? '',
            'council' => $this->address->city ?? '',
            'birth_day' => $this->birth_day,
            'cpf' => $this->cpf,
            'rg' => $this->rg,
            'studying_level' => $this->studying_level,
            'semester' => $this->semester,
            'period' => $this->period,
            'ra' => $this->ra,
            'address' => $this->address,
            'contact' => $this->contact,
            'phone' => $this->contact->phone ?? '',
            'statusLabel' => JobCandidateStatusEnum::getLabel('' . $this->pivot->status),
            'status' => (int) $this->pivot->status,
            'resume' => $resume,
            'schoolId' => $this->user->school->first()->id ?? 0,
            'interviewSchedules' => $this->invites
                ->where('job_id', $this->pivot->job_id)
                ->flatMap(function ($invite) {
                    return $invite->schedule
                        ->where('accepted', true)
                        ->map(function ($schedule) {
                            return [
                                'date' => \Carbon\Carbon::parse($schedule->date)->format('d/m/Y'),
                                'time' => \Carbon\Carbon::parse($schedule->time)->format('H:i'),
                            ];
                        });
                }),
        ];
    }
}
