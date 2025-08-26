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
        Schema::table('job_candidate', function (Blueprint $table) {
            $table->unsignedSmallInteger('status')->change();
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
            $table->enum('status', [1, 2, 3, 4, 5, 6])->change();
        });
    }
};
