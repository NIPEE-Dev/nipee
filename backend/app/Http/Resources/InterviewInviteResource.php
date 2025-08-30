<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InterviewInviteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $scheduledInterview = $this->schedule->where('accepted', '!=', null)->first();

        return [
            'id' => $this->id,
            'job' => $this->job->role,
            'company' => $this->job->company->corporate_name,
            'jobId' => $this->job_id,
            'message' => $this->message,
            'interviewDate' => $scheduledInterview->date ?? null,
            'interviewTime' => $scheduledInterview->time ?? null,
            'schedule' => InterviewScheduleResource::collection($this->schedule),
        ];
    }
}
