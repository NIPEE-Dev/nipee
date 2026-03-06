<?php

namespace App\Enums;

enum FctEvaluationStatusEnum: int
{
    case PENDING = 1;
    case WAITING_UPLOAD = 2;
    case CONCLUDED = 3;

    public static function getLabel($value): string
    {
        return match ($value) {
            FctEvaluationStatusEnum::PENDING->value => 'Pendente',
            FctEvaluationStatusEnum::WAITING_UPLOAD->value => 'Aguardando Upload',
            FctEvaluationStatusEnum::CONCLUDED->value => 'Concluído',
        };
    }
}
