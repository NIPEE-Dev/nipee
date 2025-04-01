<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCandidateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'birth_day' => 'required|date_format:d/m/Y',
            'cpf' => [
                'required',
                Rule::unique('candidates')->whereNull('deleted_at')->whereNull('candidatable_type')
            ],
            //'cpf' => 'required|unique:candidates',
            'rg' => 'required',
            'gender' => 'required',
            'studying_level' => 'required',
            //'serie' => 'required',
            //'course' => 'required',
            'period' => 'required',
            'school_id' => 'required',
            'interest' => 'required',
        ];
    }
}
