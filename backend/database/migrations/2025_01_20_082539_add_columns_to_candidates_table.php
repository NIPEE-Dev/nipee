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
        Schema::table('candidates', function (Blueprint $table) {
            $table->integer('hours_fct')->nullable();
            $table->text('volunteer_experience')->nullable();

            $table->dropColumn('studying_level');
        });

        Schema::table('candidates', function (Blueprint $table) {
            $table->enum('studying_level', ['E', 'M', 'TS', 'CP4', 'CP5', 'TESP'])->after('mandatory_internship');
        });
    }

    public function down()
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn('hours_fct');
            $table->dropColumn('volunteer_experience');
            $table->dropColumn('studying_level');
        });

        Schema::table('candidates', function (Blueprint $table) {
            $table->enum('studying_level', ['E', 'M', 'TS'])->after('mandatory_internship');
        });
    }
};
