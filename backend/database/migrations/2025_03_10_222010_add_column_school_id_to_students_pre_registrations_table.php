<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->unsignedBigInteger('school_id')->default(0);
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
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
            $table->dropForeign('students_pre_registrations_school_id_foreign');
            $table->dropColumn('school_id');
        });
    }
};
