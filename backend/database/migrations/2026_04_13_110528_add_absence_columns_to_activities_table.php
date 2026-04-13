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
        Schema::table('activities', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
            $table->string('description')->nullable()->change();
            $table->unsignedInteger('estimated_time')->nullable()->change();
            $table->boolean('has_absence')->nullable();
            $table->string('absence_description')->nullable();
            $table->string('absence_file')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->string('title')->change();
            $table->string('description')->change();
            $table->unsignedInteger('estimated_time')->change();
            $table->dropColumn('has_absence');
            $table->dropColumn('absence_description');
            $table->dropColumn('absence_file');
        });
    }
};
