<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolRequest extends FormRequest
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
            'fantasy_name' => 'required',
            'corporate_name' => 'required',

            'address.cep' => 'required',
            'address.uf' => 'required',
            'address.city' => 'required',
            'address.district' => 'required',
            'address.address' => 'required',
            'address.number' => 'required',

            'responsible.name' => 'required',
            'responsible.phone' => 'required',

            'contact.name' => 'required',
            'contact.phone' => 'required',
        ];
    }
}
