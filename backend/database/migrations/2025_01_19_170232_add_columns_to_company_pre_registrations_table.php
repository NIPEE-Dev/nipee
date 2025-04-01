<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToCompanyPreRegistrationsTable extends Migration
{
    public function up()
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->string('rejection_reason')->nullable()->after('status'); 
            $table->string('commercial_registration')->nullable()->after('rejection_reason'); 
            $table->string('line_business')->nullable()->after('commercial_registration'); 
            $table->string('cae')->nullable()->after('line_business'); 
            $table->string('status_update')->nullable()->after('cae'); 
            $table->string('password_creation_link')->nullable()->after('status_update'); 
            $table->timestamp('approved_at')->nullable()->after('password_creation_link'); 
            $table->timestamp('reject_at')->nullable()->after('approved_at'); 
        });
    }

    public function down()
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
            $table->dropColumn('commercial_registration');
            $table->dropColumn('line_business');
            $table->dropColumn('cae');
            $table->dropColumn('status_update');
            $table->dropColumn('password_creation_link');
            $table->dropColumn('approved_at');
            $table->dropColumn('reject_at');
        });
    }
}
