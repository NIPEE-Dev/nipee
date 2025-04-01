<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('financial_closes', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->renameColumn('end_date', 'reference_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('financial_closes', function (Blueprint $table) {
            $table->dateTime('start_date')->after('value');
            $table->renameColumn('reference_date', 'end_date');
        });
    }
};
