<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CandidateReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $doc = $this->jobs[0]->documents->where('type', 'Ficha de avaliação')->first() ?? null;
        $contract = $this->contracts[0]->documents[0] ?? null;
        return [
            'name' => $this->name,
            'userId' => $this->user_id,
            'courseTitle' => $this->userCourse->title ?? '',
            'startContractDate' => $this->contracts[0]->start_contract_vigence->format('d/m/Y'),
            'endContractDate' => $this->contracts[0]->end_contract_vigence->format('d/m/Y'),
            'supervisor' => $this->contracts[0]->supervisor,
            'status' => $this->contracts[0]->status,
            'avaliationFileUrl' => isset($doc) ? '/documents/' . $doc->filename . '.' . $doc->file_extension . '/download' : '',
            'contractFilename' => isset($contract) ? '/documents/' . $contract->filename . '.' . $contract->file_extension . '/download' : ''
        ];
    }
}
