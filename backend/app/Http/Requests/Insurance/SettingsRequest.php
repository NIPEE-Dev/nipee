<?php

namespace App\Http\Requests\Insurance;

use Illuminate\Foundation\Http\FormRequest;

class SettingsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'apolice' => 'sometimes|required|string|max:255',
            'subestipulante' => 'sometimes|nullable|string|max:255',
        ];
    }
}