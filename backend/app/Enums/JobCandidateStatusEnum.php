<?php

namespace App\Enums;

enum JobCandidateStatusEnum: string
{
    case PENDING = '1';
    case APPROVED = '2';
    case DENIED = '3';
    case WAITING_RESPONSE = '4';
    case INTERVIEWING = '5';
    case INTERVIEW_REJECT_BY_USER = '6';
    case TESTING = '7';

    public static function getLabel($status): string
    {
        return match ($status) {
            JobCandidateStatusEnum::PENDING->value => 'Pendente',
            JobCandidateStatusEnum::APPROVED->value => 'Aprovado',
            JobCandidateStatusEnum::DENIED->value => 'Reprovado',
            JobCandidateStatusEnum::WAITING_RESPONSE->value => 'Esperando resposta',
            JobCandidateStatusEnum::INTERVIEWING->value => 'Em entrevista',
            JobCandidateStatusEnum::INTERVIEW_REJECT_BY_USER->value => 'Entrevista rejeitadda',
            JobCandidateStatusEnum::TESTING->value => 'Em teste',
        };
    }
}
