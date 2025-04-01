<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterRequest extends FormRequest
{
    public function prepareForValidation()
    {
        if($this->get('filterFields') !== null){
            $this->merge([
                'filters' => json_decode($this->get('filterFields'), true)
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'filters.*.field' => 'sometimes|required|string|max:255',
            'filters.*.value' => 'required_with:filters.*.field',
            'filters.*.alias' => 'sometimes|required|string|max:255',
            'filters.*.label' => 'sometimes|required|string|max:255',
            'filters.*.relation' => 'sometimes|required|string|max:255',
            'filters.*.serverType' => 'sometimes|required|in:in,equals,unique,like',
        ];
    }
}