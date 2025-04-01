<?php

namespace App\Enums;

enum BooleanEnum: string
{
    case NO = '0';
    case YES = '1';

    public static function getLabel(self $value): string
    {
        return match ($value) {
            BooleanEnum::NO => 'Não',
            BooleanEnum::YES => 'Sim'
        };
    }
}