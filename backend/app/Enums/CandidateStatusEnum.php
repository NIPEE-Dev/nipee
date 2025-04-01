<?php

namespace App\Enums;

enum CandidateStatusEnum: string
{
    case CALLED = '1';
    case FORWARDED = '2';
    case IN_TESTS = '3';
    case INTERN = '4';
    case WORKER = '5';
    case HIRED = '6';
}