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
        Schema::table('financial_close_commissions', function (Blueprint $table) {
            $table->renameColumn('financial_close_items_id', 'financial_close_company_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('financial_close_commissions', function (Blueprint $table) {
            $table->renameColumn('financial_close_company_id', 'financial_close_items_id');
        });
    }
};
