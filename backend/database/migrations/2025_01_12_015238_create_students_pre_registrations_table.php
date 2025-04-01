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
        Schema::create('students_pre_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->date('birth_date');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('education_level');
            $table->string('interest_area');
            $table->text('volunteer_experience')->nullable();
            $table->string('resume');
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
        Schema::dropIfExists('students_pre_registrations');
    }
};
