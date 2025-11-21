<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateFctEvaluationRequest extends FormRequest
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
            'qualityAndOrganization' => ['required', 'integer'], // "Qualidade e organização de Trabalho",
            'integrationAndAdaptation' => ['required', 'integer'], // "Integração e Adaptação ao Contexto de Trabalho",
            'effortAndInterest' => ['required', 'integer'], // "Empenho e interesse nas funções desempenhadas",
            'learningCapacity' => ['required', 'integer'], // "Capacidade de Aprendizagem no trabalho",
            'teamWorkCapacity' => ['required', 'integer'], // "Capacidade de Trabalhar em Equipa",
            'initiative' => ['required', 'integer'], // "Espírito de Iniciativa",
            'workQuality' => ['required', 'integer'], // "Qualidade do Trabalho realizado",
            'workRhythm' => ['required', 'integer'], // "Ritmo de Trabalho",
            'comunication' => ['required', 'integer'], // "Comunicação",
            'securityNorms' => ['required', 'integer'], // "Aplicações das normas de segurança",
            'pontuality' => ['required', 'integer'], // "Assiduidade e pontualidade",
            'personalPresentation' => ['required', 'integer'], // "Apresentação pessoal",
            'interpersonalRelationship' => ['required', 'integer'], // "Relacionamento interpessoal",
            'companyCulture' => ['required', 'integer'], // "Apropriação da cultura da empresa",
            'autonomy' => ['required', 'integer'], // "Autonomia",
            'relationshipWithManagement' => ['required', 'integer'], // "Relacionamento com a chefia",
            'totalPontuation' => ['required', 'integer']
        ];
    }
}
