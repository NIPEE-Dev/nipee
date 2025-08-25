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
        Schema::create('invite_schedules', function (Blueprint $table) {
            $table->id();
            $table->boolean('accepted')->nullable();
            $table->date('date');
            $table->time('time');
            $table->unsignedBigInteger('job_interview_invite_id');
            $table->foreign('job_interview_invite_id')->references('id')->on('job_interview_invites')->onDelete('cascade');
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
        Schema::dropIfExists('invite_schedules');
    }
};
