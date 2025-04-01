<?php

use App\Models\Jobs\Job;
use App\Models\Jobs\JobWorkingDay;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs_working_day', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Job::class);

            $table->tinyInteger('start_weekday');
            $table->tinyInteger('end_weekday');
            $table->time('start_hour');
            $table->time('end_hour');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs_working_day');
    }
};
