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
        $doc = null;
        if (isset($this->jobs[0])) {
            $doc = $this->jobs[0]->documents->where('type', 'Ficha de avaliação')->first();
        }
        $contract = $this->contracts[0]->documents[0] ?? null;
        return [
            'name' => $this->name,
            'userId' => $this->user_id,
            'courseTitle' => $this->userCourse->title ?? '',
            'startContractDate' => $this->contracts[0]->start_contract_vigence->format('d/m/Y') ?? null,
            'endContractDate' => $this->contracts[0]->end_contract_vigence->format('d/m/Y') ?? null,
            'supervisor' => $this->contracts[0]->supervisor ?? null,
            'status' => $this->contracts[0]->status ?? null,
            'avaliationFileUrl' => isset($doc) ? '/documents/' . $doc->filename . '.' . $doc->file_extension . '/download' : '',
            'contractFilename' => isset($contract) ? '/documents/' . $contract->filename . '.' . $contract->file_extension . '/download' : ''
        ];
    }
}
