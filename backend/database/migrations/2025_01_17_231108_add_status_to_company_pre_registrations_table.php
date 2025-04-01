<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToCompanyPreRegistrationsTable extends Migration
{
    public function up()
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->string('status')->default('Pendente')->after('message'); 
        });
    }

    public function down()
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->dropColumn('status'); 
        });
    }
}
