<?php

namespace App\Enums\Candidate;

enum StudyingLevelEnum: string
{
    case HIGH_SCHOOL = 'E';
    case TECHNICAL_EDUCATION = 'M';
    case COLLEGE = 'TS';
    case PROFISSIONAL_NIVEL4 = 'CP4';
    case PROFISSIONAL_NIVEL5 = 'CP5';
    case TESP_5 = 'TESP';

    public static function getLabel(self $type)
    {
        return match ($type) {
            self::HIGH_SCHOOL => 'Ensino secundário',
            self::TECHNICAL_EDUCATION => 'Técnico',
            self::COLLEGE => 'Superior',
            self::PROFISSIONAL_NIVEL4 => 'Cursos Profissionais nível 4',
            self::PROFISSIONAL_NIVEL5 => 'Cursos Profissionais CET nível 5',
            self::TESP_5 => 'TESP',
        };
    }
}