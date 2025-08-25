<?php

namespace App\Enums;

enum JobInterviewInviteStatusEnum: int
{
    case PENDING = 0;
    case ACCEPTED = 1;
    case DENIED = 2;

    public static function getLabel(self $status): string
    {
        return match ($status) {
            JobInterviewInviteStatusEnum::PENDING => 'Pendente',
            JobInterviewInviteStatusEnum::ACCEPTED => 'Aceito',
            JobInterviewInviteStatusEnum::DENIED => 'Recusado',
        };
    }
}
