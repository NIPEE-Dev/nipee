<?php

namespace App\Enums;

enum UserCandidateStatusEnum: int
{
    case AVAILABLE = 0;
    case IN_FCT = 1;
    case CONCLUDED = 2;

    public static function getLabel($status): string
    {
        return match ($status) {
            CandidateStatusEnum::PENDING->value => 'Disponível',
            CandidateStatusEnum::APPROVED->value => 'Em FCT',
            CandidateStatusEnum::DENIED->value => 'Concluído',
        };
    }
}
