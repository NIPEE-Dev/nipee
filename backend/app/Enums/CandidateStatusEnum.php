<?php

namespace App\Enums;

enum CandidateStatusEnum: string
{
    case PENDING = '1';
    case APPROVED = '2';
    case DENIED = '3';

    public static function getLabel(self $status): string
    {
        return match ($status) {
            CandidateStatusEnum::PENDING => 'Pendente',
            CandidateStatusEnum::APPROVED => 'Aprovado',
            CandidateStatusEnum::DENIED => 'Reprovado',
        };
    }
}
