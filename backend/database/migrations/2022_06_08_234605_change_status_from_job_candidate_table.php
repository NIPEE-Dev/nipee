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
        Schema::table('job_candidate', function (Blueprint $table) {
            DB::statement("ALTER TABLE job_candidate CHANGE `status` `status` ENUM('1', '2', '3', '4', '5', '6') NOT NULL DEFAULT '1'");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_candidate', function (Blueprint $table) {
            DB::statement("ALTER TABLE job_candidate CHANGE `status` `status` ENUM('0', '1', '2') NOT NULL DEFAULT '0'");
        });
    }
};
