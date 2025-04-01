<?php

namespace App\Enums;

enum BaseRecordsEnum: int
{
    case ROLES = 1;
    case HOW_FIND_US = 2;
    case REASON_FOR_EXIT = 3;
    case REASON_FOR_DISAPPROVE = 4;
    case HOLIDAYS = 5;
    case COURSES = 6;
    case CITIES = 7;

    public static function getLabel(self $value): string
    {
        return match ($value) {
            BaseRecordsEnum::ROLES => 'Funções',
            BaseRecordsEnum::HOW_FIND_US => 'Como nos conheceu',
            BaseRecordsEnum::REASON_FOR_EXIT => 'Motivos de rescisão',
            BaseRecordsEnum::REASON_FOR_DISAPPROVE => 'Motivos de reprovação',
            BaseRecordsEnum::HOLIDAYS => 'Feriados',
            BaseRecordsEnum::COURSES => 'Cursos',
            BaseRecordsEnum::CITIES => 'Cidades',
        };
    }
}