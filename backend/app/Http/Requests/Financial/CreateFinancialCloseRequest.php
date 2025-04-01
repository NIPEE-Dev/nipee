<?php

namespace App\Http\Requests\Financial;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CreateFinancialCloseRequest extends FormRequest
{
    /**
     * Prepare the data for validation
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $monthLastDay = Carbon::createFromFormat("Y-m", $this->post('reference_date'))->endOfMonth()->subDays(4)->toDateString();
        $this->merge([
            'reference_date' => $monthLastDay
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'reference_date' => 'required|date'
        ];
    }
}