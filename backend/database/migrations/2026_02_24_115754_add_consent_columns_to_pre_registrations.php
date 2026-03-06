<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->timestamp('accepted_terms_at')->nullable()->after('message');
            $table->string('user_ip', 45)->nullable()->after('accepted_terms_at');
            $table->string('user_agent')->nullable()->after('user_ip'); 
        });

        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->timestamp('accepted_terms_at')->nullable()->after('resume');
            $table->string('user_ip', 45)->nullable()->after('accepted_terms_at');
            $table->string('user_agent')->nullable()->after('user_ip');
        });
    }

    public function down(): void
    {
        Schema::table('company_pre_registrations', function (Blueprint $table) {
            $table->dropColumn(['accepted_terms_at', 'user_ip', 'user_agent']);
        });

        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->dropColumn(['accepted_terms_at', 'user_ip', 'user_agent']);
        });
    }
};