<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'job.scholarship_nominal_value' => ['required'],
            'job.scholarship_value' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'job.scholarship_nominal_value.required' => 'Bolsa é obrigatório',
            'job.scholarship_value.required' => 'Valor nominal da bolsa é obrigatório',
        ];
    }
}
