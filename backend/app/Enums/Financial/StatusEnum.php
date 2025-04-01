<?php

namespace App\Enums\Financial;

enum StatusEnum: string
{
    case DRAFT = '0';
    case BILLED = '1';
}