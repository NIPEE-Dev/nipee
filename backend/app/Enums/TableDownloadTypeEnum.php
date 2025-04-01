<?php

namespace App\Enums;

enum TableDownloadTypeEnum: string
{
    case Jobs = 'Jobs';
    case Companies = 'Companies';
    case Schools = 'Schools';
    case Candidates = 'Candidates';
    case Contracts = 'Contracts';
    case Documents = 'Documents';
}