<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCandidateFeedbackRequest extends FormRequest
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
            'annotation' => ['nullable', 'string', 'required_without:annotations'],
            'annotations' => ['nullable', 'array', 'required_without:annotation', 'min:1'],
            'annotations.*' => ['required', 'string'],
        ];
    }
}
