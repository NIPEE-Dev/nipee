<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->boolean('school_signature')->default(false);
            $table->string('school_signature_path')->nullable();
            $table->boolean('company_signature')->default(false);
            $table->string('company_signature_path')->nullable();
        });
    }

    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn(['school_signature', 'school_signature_path', 'company_signature', 'company_signature_path']);
        });
    }
};

