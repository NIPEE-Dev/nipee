<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->unsignedBigInteger('course')->nullable()->after('id');

            $table->foreign('course')
                ->references('id')
                ->on('base_records')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->dropForeign(['course']);
            $table->dropColumn('course');
        });
    }
};
