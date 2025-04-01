<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('responsibles', function (Blueprint $table) {
            $table->date('validade')->nullable()->after('document');
        });
    }

    public function down(): void
    {
        Schema::table('responsibles', function (Blueprint $table) {
            $table->dropColumn('validade');
        });
    }
};
