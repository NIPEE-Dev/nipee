<?php

namespace App\Enums;

enum FileUploadTypeEnum: string
{
    case CONTRACT = 'Contracts';
    case ADDENDUM = 'Addendum';
    case CUURRICULUM = 'CurriculumVitae';
    case COVERLETTER = 'CoverLetter';
    case SCHOOL_STATEMENT = 'School_Statement';
    case EVALUATION_CLOSES = 'Evaluation_Closes';
    case VOLUNTEERING = 'Volunteering';

    case OTHERS = 'Others';

    public static function getLabel(self $fileType): string
    {
        return match ($fileType) {
            FileUploadTypeEnum::CONTRACT => 'Protocolo',
            FileUploadTypeEnum::ADDENDUM => 'Adendo',
            FileUploadTypeEnum::SCHOOL_STATEMENT => 'Declaração Escolar',
            FileUploadTypeEnum::EVALUATION_CLOSES => 'Ficha de avaliação',
            FileUploadTypeEnum::OTHERS => 'Outros',
            FileUploadTypeEnum::CUURRICULUM => 'Curriculum Vitae (CV)',
            FileUploadTypeEnum::VOLUNTEERING => 'Voluntariado',
            FileUploadTypeEnum::COVERLETTER => 'Carta de Apresentação'
        };
    }
}