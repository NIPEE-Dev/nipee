<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyPreRegistrationsTable extends Migration
{
    public function up()
    {
        Schema::create('company_pre_registrations', function (Blueprint $table) {
            $table->id(); 
            $table->string('company_name'); 
            $table->string('nif'); 
            $table->string('representative_name'); 
            $table->string('corporate_email'); 
            $table->string('phone')->nullable(); 
            $table->string('sector'); 
            $table->integer('student_vacancies')->nullable(); 
            $table->text('message')->nullable(); 
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('company_pre_registrations');
    }
}
