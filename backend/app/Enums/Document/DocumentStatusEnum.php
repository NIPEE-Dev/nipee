<?php

namespace App\Enums\Document;

enum DocumentStatusEnum: string
{
    case GENERATED = '0';
    case SENT = '1';
    case RETURNED = '2';
    case PENDING_COMPANY_SIGNATURE = '3';
    case PENDING_SCHOOL_SIGNATURE = '4';
    case SIGNARTURE = '5';

    public static function getLabel($value)
    {
        return match ($value) {
            DocumentStatusEnum::GENERATED => 'Gerado',
            DocumentStatusEnum::SENT => 'Enviado',
            DocumentStatusEnum::RETURNED => 'Devolvido',
            DocumentStatusEnum::PENDING_COMPANY_SIGNATURE => 'Aguardando assinatura Empresa',
            DocumentStatusEnum::PENDING_SCHOOL_SIGNATURE => 'Aguardando assinatura Escola',
            DocumentStatusEnum::SIGNARTURE => 'Assinado',
        };
    }
}
