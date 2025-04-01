<?php

namespace App\Enums;

enum InterestEnum: string
{
    case Internship = 'ES';
    case EFFECTIVE = 'EF';
    case BOTH = 'AM';

    public static function getLabel($value)
    {
        return match($value){
            InterestEnum::Internship => 'Estágio',
            InterestEnum::EFFECTIVE => 'FCT',
            InterestEnum::BOTH => 'Efetivo',
        };
    }
}