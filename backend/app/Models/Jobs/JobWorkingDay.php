<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobWorkingDay extends Model
{
    public $table = 'jobs_working_day';

    public $timestamps = false;

    public $fillable = [
        'start_weekday',
        'end_weekday',
        'start_hour',
        'end_hour',
        'day_off_start_weekday',
        'day_off_start_hour',
        'day_off_end_hour',
        'day_off',
        'working_hours',
    ];
}