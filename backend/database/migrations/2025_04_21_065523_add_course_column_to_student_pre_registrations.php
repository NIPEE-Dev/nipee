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
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->dropColumn('course');
            $table->bigInteger('course')->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->dropColumn('course');
        });
    }
};
