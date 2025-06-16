<?php

namespace App\Enums\Activities;

enum ActivityStatusEnum: int
{
    case DRAFT = 0;
    case PENDING = 1;
    case REPROVED = 2;
    case APPROVED = 3;

    public static function parseStatus($status)
    {
        switch ($status) {
            case self::DRAFT->value:
                return "Rascunho";
            case self::PENDING->value:
                return "Pendente";
            case self::REPROVED->value:
                return "Reprovado";
            case self::APPROVED->value:
                return "Aprovado";
            default:
                return '';
        }
    }
}
