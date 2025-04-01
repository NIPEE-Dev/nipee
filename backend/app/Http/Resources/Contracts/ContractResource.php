<?php

namespace App\Http\Resources\Contracts;

use App\Enums\ActiveEnum;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray($request)
    {
        return array_merge(parent::toArray($request), [
            'address' => $this->whenLoaded('company', $this->resource->company->address),
            'start_contract_vigence' => $this->resource->start_contract_vigence->format("Y-m-d"),
            'end_contract_vigence' => $this->resource->end_contract_vigence->format("Y-m-d"),
            'role' => $this->resource->job->role,
            'terminated_at' => $this->resource->terminated_at?->format("d/m/Y"),
            'status' => $this->getStatus(),
            'end_contract_reason' => $this->when(isset($this->reasonForTermination), fn() => $this->reasonForTermination->title),
            'retroative_billing' => $this->retroative_billing ? 1 : 0,
            'recolocation' => $this->recolocation ? 1 : 0,
            'job' => array_merge($this->job->toArray(), ['type' => $this->originalJob->type]),
            'userAddress' => $this->whenLoaded('userAddress', fn() => $this->userAddress),
            'jobOtherAddress' => $this->whenLoaded('jobOtherAddress', fn() => $this->jobOtherAddress),
        ]);
    }

    private function getStatus()
    {
        $status = $this->resource->status;
        $endedContract = Carbon::parse($this->resource->end_contract_vigence)->isBefore(now());

        if ($status === ActiveEnum::NOT_ACTIVE) {
            return 0;
        } else if ($endedContract) {
            return 2;
        } else {
            return 1;
        }

    }
}