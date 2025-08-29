<?php

namespace App\Enums;

enum CandidateStatusEnum: string
{
    case PENDING = '1';
    case APPROVED = '2';
    case DENIED = '3';

    public static function getLabel($status): string
    {
        return match ($status) {
            CandidateStatusEnum::PENDING->value => 'Pendente',
            CandidateStatusEnum::APPROVED->value => 'Aprovado',
            CandidateStatusEnum::DENIED->value => 'Reprovado',
        };
    }
}
