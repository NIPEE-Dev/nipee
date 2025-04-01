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
            $table->time('start_hour')->nullable()->change();
            $table->time('end_hour')->nullable()->change();
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
            $table->time('start_hour')->change();
            $table->time('end_hour')->change();
        });
    }
};
