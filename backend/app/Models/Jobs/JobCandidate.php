<?php

namespace App\Models\Jobs;

use App\Enums\DisapprovedEnum;
use App\Enums\CandidateStatusEnum;
use Illuminate\Database\Eloquent\Relations\Pivot;

class JobCandidate extends Pivot
{
    public $table = 'job_candidate';

    public $fillable = [
        'status',
        'disapproved'
    ];

    public $casts = [
        'status' => CandidateStatusEnum::class,
        'disapproved' => DisapprovedEnum::class
    ];
}