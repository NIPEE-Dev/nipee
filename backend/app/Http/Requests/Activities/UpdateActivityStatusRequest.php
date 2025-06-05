<?php

namespace App\Http\Requests\Activities;

use App\Enums\Activities\ActivityTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateActivityStatusRequest extends FormRequest
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
            'approved' => ['required', 'boolean'],
            'justification' => ['required_if:approved,=,false', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'justification.required_if' => 'É obrigatório uma justificativa ao reprovar',
        ];
    }
}
