<?php

namespace App\Http\Requests\Credentials;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
        return [
            'title' => [
                'required',
                $this->has('id')
                    ? Rule::unique('roles')->withoutTrashed()->ignore((int)$this->post('id'))
                    : 'unique:roles'
            ]
        ];
    }
}
