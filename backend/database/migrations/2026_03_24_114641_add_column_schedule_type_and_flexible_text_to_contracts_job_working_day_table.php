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
        Schema::table('contracts_job_working_day', function (Blueprint $table) {
            $table->string('schedule_type')->default('fixed');
            $table->text('flexible_text')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts_job_working_day', function (Blueprint $table) {
            $table->dropColumn('schedule_type');
            $table->dropColumn('flexible_text');
        });
    }
};
