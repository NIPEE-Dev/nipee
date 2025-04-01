<?php

namespace App\Enums\Financial;

enum ItemTypeEnum: string
{
    case ACCESSION = '0';
    case MONTHLY_PAYMENT = '1';
    case RECOLOCATION = '2';
    case ACCESSION_RETROATIVE = '3';
}