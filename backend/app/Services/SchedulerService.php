<?php

namespace App\Services;

use Illuminate\Console\Scheduling\Schedule;

class SchedulerService
{
    public function schedule(Schedule $schedule): void
    {
        $schedule->command('contracts:evaluation-sheet')->yearlyOn(1, time: '13:00');
        $schedule->command('contracts:evaluation-sheet')->yearlyOn(7, time: '13:00');

        $schedule->command('contracts:common-alerts')->dailyAt('10:00');
    }
}