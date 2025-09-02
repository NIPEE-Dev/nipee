<?php

namespace App\Http\Resources\Jobs;

use App\Enums\ActiveEnum;
use App\Enums\BooleanEnum;
use App\Enums\GenderEnum;
use App\Enums\PeriodEnum;
use App\Enums\RolesEnum;
use App\Http\Resources\Companies\CompanyResource;
use App\Http\Resources\JobCandidateResource;
use App\Models\Candidate;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class JobResource extends JsonResource
{
    public function toArray($request)
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $compatibleCandidates = [];
        if (isset($this->courses)) {
            $coursesIds = $this->courses->pluck('id');
            $candidatesIds = $this->candidates->pluck('id');
            $allowedGenders = $this->gender === GenderEnum::AMBOS->value ? [GenderEnum::FEMALE->value, GenderEnum::MALE->value] : [$this->gender];
            $candidates = Candidate::query()
                ->whereNotIn('id', $candidatesIds)
                ->where(function ($q) {
                    $q->orWhereDoesntHave('contracts')->orWhereHas('contracts', function ($query) {
                        $query->where('status', ActiveEnum::NOT_ACTIVE->value);
                    });
                })
                ->whereIn('course', $coursesIds)->whereIn('gender', $allowedGenders)->get();
            $compatibleCandidates = $candidates;
        }

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
            'corporate_name' => $this->company->corporate_name,
            'fantasy_name' => $this->company->fantasy_name,
            'working_day' => new JobWorkingDayResource($this->whenLoaded('workingDay')),
            'role' => $this->role,
            'documents' => $this->whenLoaded('documents'),
            'available_candidatures' => $this->when($roleId === RolesEnum::CANDIDATE->value, $this->available - count($this->candidates)),
            'competences' => $this->competences,
            'location' => $this->location,
            'fct_hours' => $this->fct_hours,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'status' => $this->status,
            'already_applied' => $this->when($roleId === RolesEnum::CANDIDATE->value, $this->candidates->where('id', $user->candidate->id ?? null)->first() !== null),
            'candidates' => $this->when($roleId === RolesEnum::COMPANY->value, JobCandidateResource::collection($this->candidates)),
            'compatible_candidates' => $this->when($roleId === RolesEnum::COMPANY->value && isset($this->courses), $compatibleCandidates),
        ];
    }
}
