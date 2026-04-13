<?php

namespace App\Http\Requests\Activities;

use App\Enums\Activities\ActivityTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateActivityRequest extends FormRequest
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
            'draft' => ['required', 'boolean'],
            'activityDate' => ['required', 'date_format:Y-m-d'],
            'title' => [Rule::requiredIf($this->input('hasAbsence') === 0), 'nullable', 'string'],
            'description' => [Rule::requiredIf($this->input('hasAbsence') === 0), 'nullable', 'string'],
            'estimatedTime' => [Rule::requiredIf($this->input('hasAbsence') === 0), 'nullable', 'integer', 'gte:0'],
            'hasAbsence' => ['boolean'],
            'absenceDescription' => [Rule::requiredIf($this->input('hasAbsence') === 1), 'string'],
            'absenceFile' => ['nullable', 'file'],
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Título é obrigatório',
            'title.string' => 'Título deve ser um texto',
            'description.required' => 'Descrição é obrigatório',
            'description.string' => 'Descrição deve ser um texto',
            'type.enum' => 'Tipo inválido',
            'type' => 'Tipo é obrigatório',
            'estimatedTime.required' => 'Duração estimada é obrigatório',
            'estimatedTime.integer' => 'Duração estimada deve ser um número inteiro',
            'estimatedTime.gt' => 'Duração estimada deve ser maior que 0',
            'activityDate.required' => 'Data da atividade é obrigatório',
            'activityDate.date_format' => 'Data da atividade deve ser no seguinte formato: YYYY-MM-DD',
            'observation.string' => 'Observação deve ser um textos'
        ];
    }
}
