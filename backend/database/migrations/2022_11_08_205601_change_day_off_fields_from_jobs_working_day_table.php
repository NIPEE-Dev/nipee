<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('jobs_working_day', function (Blueprint $table) {
            $table->after('end_hour', function (Blueprint $table) {
                $table->tinyInteger('day_off_start_weekday')->nullable();
                $table->time('day_off_start_hour')->nullable();
                $table->time('day_off_end_hour')->nullable();
                $table->string('day_off', 191);
                $table->integer('working_hours');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('jobs_working_day', function (Blueprint $table) {
            $table->dropColumn(['day_off_start_weekday', 'day_off_start_hour', 'day_off_end_hour', 'day_off', 'working_hours']);
        });
    }
};
