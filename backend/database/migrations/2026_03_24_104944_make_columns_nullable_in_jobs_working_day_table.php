<?php

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
        Schema::table('jobs_working_day', function (Blueprint $table) {
            $table->smallInteger('start_weekday')->nullable()->change();
            $table->smallInteger('end_weekday')->nullable()->change();
            $table->integer('working_hours')->nullable()->change();
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
            $table->smallInteger('start_weekday')->change();
            $table->smallInteger('end_weekday')->change();
            $table->integer('working_hours')->change();
        });
    }
};
