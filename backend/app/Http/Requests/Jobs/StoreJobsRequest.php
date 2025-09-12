<?php

namespace App\Http\Requests\Jobs;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'company_id' => 'required|exists:companies,id',
            // 'role_id' => 'required|numeric',
            'role' => ['required', 'string'],
            'courses' => ['required', 'array', 'min:1'],
            'courses.*' => ['required', 'integer'],
            'competences' => ['required', 'string', 'max:1000'],
            'start_at' => ['required', 'date', 'date_format:Y-m-d'],
            'end_at' => ['required', 'date', 'date_format:Y-m-d'],
            'location' => ['required', 'string'],
            'period' => 'required|in:N,T,M,MN',
            'gender' => 'required|in:F,M,FM',

            'transport_voucher' => 'required|bool',
            'transport_voucher_value' => 'exclude_if:transport_voucher,0',
            'transport_voucher_nominal_value' => ['exclude_if:transport_voucher,0', 'string', 'max:255'],

            'scholarship_value' => 'nullable|numeric',
            'scholarship_nominal_value' => ['string', 'max:255'],
            'available' => 'required|numeric',
            'type' => 'required|in:ES,EF',
            'fct_hours' => ['required_if:type,EF', 'integer'],
            'draft' => ['boolean'],
            'show_web' => 'required|bool',
            'description' => ['required', 'string', 'max:2000'],
            'working_day.start_weekday' => 'required|between:0,6',
            'working_day.end_weekday' => 'required|between:0,6',
            'working_day.start_hour' => 'nullable',
            'working_day.end_hour' => 'nullable',
            'max_approvals' => ['required', 'integer'],
        ];
    }
}
