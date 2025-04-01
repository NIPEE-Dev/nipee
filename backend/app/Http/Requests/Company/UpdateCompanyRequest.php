<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $data = $this->toArray();

        $this->whenFilled('address.cep', fn() => data_set($data, 'address.cep', preg_replace('/\D/', '', $this->address['cep'])));
        $this->whenFilled('billing.colocacao', fn() => data_set($data, 'billing.colocacao', preg_replace('/\D/', '', $this->billing['colocacao'])));
        $this->whenFilled('billing.monthly_payment', fn() => data_set($data, 'billing.monthly_payment', preg_replace('/\D/', '', $this->billing['monthly_payment'])));
        $this->whenFilled('responsible.phone', fn() => data_set($data, 'responsible.phone', preg_replace('/\D/', '', $this->responsible['phone'])));
        $this->whenFilled('contact.phone', fn() => data_set($data, 'contact.phone', preg_replace('/\D/', '', $this->contact['phone'])));

        $this->merge($data);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}