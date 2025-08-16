<?php

namespace App\Enums;

enum JobCandidateStatusEnum: string
{
    case PENDING = '1';
    case APPROVED = '2';
    case DENIED = '3';

    public static function getLabel(self $status): string
    {
        return match ($status) {
            JobCandidateStatusEnum::PENDING => 'Pendente',
            JobCandidateStatusEnum::APPROVED => 'Aprovado',
            JobCandidateStatusEnum::DENIED => 'Reprovado',
        };
    }
}
