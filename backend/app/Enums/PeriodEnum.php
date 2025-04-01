<?php

namespace App\Enums;

use Illuminate\Support\Facades\Log;

enum PeriodEnum: string
{
    case MORNING = 'M';
    case AFTERNOON = 'T';
    case NIGHT = 'N';
    case MN = 'MN';
    case INTEGRAL = 'I';

    public static function getLabel($value)
    {

        return match ($value) {
            PeriodEnum::MORNING => 'Manhã',
            PeriodEnum::AFTERNOON => 'Tarde',
            PeriodEnum::NIGHT => 'Noite',
            PeriodEnum::MN => 'Integral',
            PeriodEnum::INTEGRAL => 'Integral',
            default => 'Período desconhecido',
        };
    }
}
