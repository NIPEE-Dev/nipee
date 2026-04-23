<?php

namespace App\Http\Resources;

use App\Enums\ActiveEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateFeedbackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $activeContract = $this->contracts()
            ->withoutTrashed()
            ->where('status', '=', ActiveEnum::ACTIVE->value)->first();

        return [
            'candidate' => [
                'id' => $this->id,
                'name' => $this->name,
                'nif' => $this->cpf,
            ],
            'school' => [
                'id' => $activeContract->school->id,
                'name' => $activeContract->school->corporate_name,
            ],
            'feedback' => $this->feedback->map(function ($item, $key) {
                return [
                    'id' => $item->id,
                    'annotation' => $item->annotation,
                    'createdAt' => $item->created_at,
                ];
            }),
            'company' => [
                'id' => $activeContract->company->id,
                'name' => $activeContract->company->corporate_name,
            ],
            'job' => [
                'id' => $activeContract->job->id,
                'role' => $activeContract->job->role,
            ],
        ];
    }
}
