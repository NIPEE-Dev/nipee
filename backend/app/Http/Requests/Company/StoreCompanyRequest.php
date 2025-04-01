<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $data = $this->toArray();

        data_set($data, 'address.cep', preg_replace('/\D/', '', $this->address['cep']));
        data_set($data, 'billing.colocacao', preg_replace('/\D/', '', $this->billing['colocacao']));
        data_set($data, 'billing.monthly_payment', preg_replace('/\D/', '', $this->billing['monthly_payment']));
        data_set($data, 'responsible.phone', preg_replace('/\D/', '', $this->responsible['phone']));
        data_set($data, 'contact.phone', preg_replace('/\D/', '', $this->contact['phone']));

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
            'fantasy_name' => 'required',
            'corporate_name' => 'required',
            'branch_of_activity' => 'required',
            'supervisor' => 'required',
            'type' => 'required',
            'cnpj' => 'exclude_if:type,PF',
            'start_contract_vigence' => 'date_format:Y-m-d',

            'address.cep' => 'required',
            'address.uf' => 'required',
            'address.city' => 'required',
            'address.district' => 'required',
            'address.address' => 'required',
            'address.number' => 'required',

            'billing.seller_id' => 'required',
            'billing.colocacao' => 'required',
            'billing.monthly_payment' => 'required',
            'billing.email' => 'required',
            'billing.due_date' => 'required',
            'billing.business_day' => 'required',
            'billing.issue_invoice' => 'required',
            'billing.issue_bank_slip' => 'required',

            'responsible.name' => 'required',
            'responsible.phone' => 'required',
            'responsible.email' => 'required',

            'contact.name' => 'required',
            'contact.phone' => 'required',
        ];
    }
}