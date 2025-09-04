<?php

namespace App\Enums;

enum JobCandidateStatusEnum: string
{
    case CALLED = '1';
    case FORWARDED = '2';
    case HIRED = '3';
}