<?php

namespace App\Http\Requests\Activities;

use App\Enums\Activities\ActivityTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateActivityRequest extends FormRequest
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
            'draft' => ['string'],
            'title' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'estimatedTime' => ['nullable', 'integer', 'gt:0'],
            'hasAbsence' => ['boolean'],
            'absenceDescription' => ['string'],
            'absenceFile' => ['file'],
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
            'estimatedTime.integer' => 'Duração estimada deve ser um número inteiro',
            'estimatedTime.gt' => 'Duração estimada deve ser maior que 0',
            'activityDate.date_format' => 'Data da atividade deve ser no seguinte formato: YYYY-MM-DD',
            'observation.string' => 'Observação deve ser um textos'
        ];
    }
}
