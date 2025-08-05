<?php

namespace App\Enums;

enum JobStatusEnum: int
{
    case DRAFT = 0;
    case OPEN = 1;
    case CLOSED = 2;
    case FULL = 3;

    public static function getLabel(self $status): string
    {
        return match ($status) {
            JobStatusEnum::DRAFT => 'Rascunho',
            JobStatusEnum::OPEN => 'Aberta',
            JobStatusEnum::CLOSED => 'Fechada/Encerrada',
            JobStatusEnum::FULL => 'Vagas Ocupadas',
        };
    }
}
