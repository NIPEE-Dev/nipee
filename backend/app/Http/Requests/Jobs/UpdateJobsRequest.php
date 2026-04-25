<?php

namespace App\Http\Requests\Jobs;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobsRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [

            'company_id' => 'sometimes|exists:companies,id',
            'branch_id' => 'nullable|exists:company_branches,id',
            'sector_id' => 'nullable|exists:company_sectors,id',

            'fct_hours' => ['required_if:type,EF', 'integer'],
            'draft' => ['boolean'],
            'role' => ['sometimes', 'string'],
            'courses' => ['sometimes', 'array', 'min:1'],
            'courses.*' => ['sometimes', 'integer'],
            'competences' => ['sometimes', 'string', 'max:1000'],
            'start_at' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'end_at' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'location' => ['sometimes', 'string'],

            // 'role_id' => 'sometimes|numeric',
            'period' => 'sometimes|in:N,T,M,MN',
            'gender' => 'sometimes|in:F,M,FM',

            'transport_voucher' => 'sometimes|bool',
            'transport_voucher_value' => 'exclude_if:transport_voucher,0|numeric',
            'transport_voucher_nominal_value' => ['exclude_if:transport_voucher,0', 'string', 'max:255'],

            'scholarship_value' => 'sometimes|numeric',
            'scholarship_nominal_value' => ['sometimes', 'string', 'max:255'],
            'available' => 'sometimes|numeric',
            'type' => 'sometimes|in:ES,EF',
            'show_web' => 'sometimes|bool',
            'description' => ['sometimes', 'string', 'max:2000'],

            'workingDay.start_weekday' => 'sometimes|numeric|between:0,6',
            'workingDay.end_weekday' => 'sometimes|numeric|between:0,6',
            'workingDay.start_hour' => 'sometimes',
            'workingDay.end_hour' => 'sometimes',

            'workingDay.day_off_start_weekday' => 'sometimes|numeric|between:0,6',
            'workingDay.day_off_start_hour' => 'sometimes',
            'workingDay.day_off_end_hour' => 'sometimes',
            'workingDay.day_off' => 'sometimes|string|min:2|max:255',
            'workingDay.working_hours' => 'sometimes|numeric|between:1,168',
            'max_approvals' => ['sometimes', 'integer'],
        ];
    }
}
