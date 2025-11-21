<?php

namespace App\Enums;

enum FctEvaluationStatusEnum: int
{
    case PENDING = 1;
    case WAITING_UPLOAD = 2;
    case CONCLUDED = 3;

    public static function getLabel(self $value): string
    {
        return match ($value) {
            FctEvaluationStatusEnum::PENDING => 'Pendente',
            FctEvaluationStatusEnum::WAITING_UPLOAD => 'Aguardando Upload',
            FctEvaluationStatusEnum::CONCLUDED => 'Concluído',
        };
    }
}
