<?php

namespace App\Http\Resources\Jobs;

use App\Enums\BooleanEnum;
use App\Enums\GenderEnum;
use App\Enums\PeriodEnum;
use App\Http\Resources\Companies\CompanyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'role_id' => $this->role_id,
            'period' => $this->period,
            'period_title' => PeriodEnum::getLabel($this->period),
            'gender' => $this->gender,
            'gender_title' => GenderEnum::getLabel($this->gender),
            'transport_voucher' => $this->transport_voucher,
            'transport_voucher_value' => (float)$this->transport_voucher_value,
            'transport_voucher_nominal_value' => $this->transport_voucher_nominal_value,
            'meal_voucher' => (float)$this->meal_voucher,
            'scholarship_value' => (float)$this->scholarship_value,
            'scholarship_nominal_value' => $this->scholarship_nominal_value,
            'available' => $this->available,
            'type' => $this->type,
            'show_web' => $this->show_web,
            'show_web_title' => BooleanEnum::getLabel($this->show_web),
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'description' => $this->description,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'working_day' => new JobWorkingDayResource($this->whenLoaded('workingDay')),
            'role' => new JobWorkingDayResource($this->whenLoaded('role')),
            'documents' => $this->whenLoaded('documents'),
        ];
    }
}