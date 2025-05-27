<?php

namespace App\Enums\Activities;

enum ActivityStatusEnum: int
{
    case DRAFT = 0;
    case PENDING = 1;
    case REPROVED = 2;
    case APPROVED = 3;
}
