<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInterviewInviteRequest extends FormRequest
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
            'message' => ['required', 'string'],
            'candidateId' => ['required', 'exists:candidates,id'],
            'schedules' => ['required', 'array', 'min:1'],
            'schedules.*.date' => ['required', 'date', 'date_format:Y-m-d'],
            'schedules.*.time' => ['required', 'date_format:H:i'],
        ];
    }
}
