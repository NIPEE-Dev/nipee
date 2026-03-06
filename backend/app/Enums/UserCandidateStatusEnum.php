<?php

namespace App\Enums;

enum UserCandidateStatusEnum: int
{
    case AVAILABLE = 0;
    case IN_FCT = 1;
    case CONCLUDED = 2;

    public static function getLabel($status): string
    {
        switch ($status) {
            case 0:
                return 'Disponível';
            case 1:
                return 'Em FCT';
            case 2:
                return 'Concluído';
            default:
                return '';
        }
    }
}
