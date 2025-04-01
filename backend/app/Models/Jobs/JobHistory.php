<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobHistory extends Model
{
    public $table = 'job_history';

    public $fillable = [
        'candidate_id',
        'job_id',
        'status'
    ];
}