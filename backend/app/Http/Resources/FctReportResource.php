<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FctReportResource extends JsonResource
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
            'candidateName' => $this->candidate_name,
            'companyName' => $this->company_name,
            'totalHours' => $this->total_hours,
            'sentDate' => $this->sent_date,
            'report' => $this->report
        ];
    }
}
