<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return match ($this->method()) {
            'POST' => [
                'name' => ['required', 'min:3', 'max:255'],
                'email' => ['required', 'email', 'unique:users'],
            ],
            'PUT' => [
                'name' => ['sometimes', 'required', 'min:3', 'max:255'],
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    $this->has('id')
                        ? Rule::unique('users')->withoutTrashed()->ignore((int)$this->post('id'))
                        : 'unique:users'
                ],

            ]
        };
    }
}
