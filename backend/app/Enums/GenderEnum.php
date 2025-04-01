<?php

namespace App\Enums;

enum GenderEnum: string
{
    case MALE = 'M';
    case FEMALE = 'F';
    case AMBOS = 'FM';

    public static function getLabel($value)
    {
        return match($value){
            GenderEnum::MALE => 'Masculino',
            GenderEnum::FEMALE => 'Feminino',
            GenderEnum::AMBOS => 'Ambos',
        };
    }
}