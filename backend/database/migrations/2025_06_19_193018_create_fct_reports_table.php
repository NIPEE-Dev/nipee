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
        Schema::create('fct_reports', function (Blueprint $table) {
            $table->id();
            $table->string('candidate_name');
            $table->string('company_name');
            $table->integer('total_hours');
            $table->string('report');
            $table->date('sent_date');
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
        Schema::dropIfExists('fct_reports');
    }
};
