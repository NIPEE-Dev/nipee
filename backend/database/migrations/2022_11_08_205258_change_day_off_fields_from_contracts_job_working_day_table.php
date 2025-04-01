<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contracts_job_working_day', function (Blueprint $table) {
            DB::statement("ALTER TABLE contracts_job_working_day CHANGE COLUMN day_off_start_weekday day_off_start_weekday TINYINT UNSIGNED NULL");
            $table->time('day_off_start_hour')->nullable()->change();
            $table->time('day_off_end_hour')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts_job_working_day', function (Blueprint $table) {
            DB::statement("ALTER TABLE contracts_job_working_day CHANGE COLUMN day_off_start_weekday day_off_start_weekday TINYINT UNSIGNED NOT NULL");
            $table->time('day_off_start_hour')->change();
            $table->time('day_off_end_hour')->change();
        });
    }
};
