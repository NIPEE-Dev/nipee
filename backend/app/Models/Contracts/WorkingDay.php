<?php

namespace App\Models\Contracts;

use Illuminate\Database\Eloquent\Model;

class WorkingDay extends Model
{
    public $table = 'contracts_job_working_day';

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
        'schedule_type',
        'flexible_text',
    ];
}
