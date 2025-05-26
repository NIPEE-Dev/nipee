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
        if (Schema::hasColumn('students_pre_registrations', 'interest_area')) {
            Schema::table('students_pre_registrations', function (Blueprint $table) {
                $table->dropColumn('interest_area');
            });
        }
    }

    public function down()
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->string('interest_area')->nullable();
        });
    }
};
