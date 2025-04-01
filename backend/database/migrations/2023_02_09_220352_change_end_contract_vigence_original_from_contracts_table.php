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
        Schema::table('contracts', function (Blueprint $table) {
            $table->date('terminated_at')->nullable()->after('end_contract_vigence');
            $table->dropColumn('end_contract_vigence_original');
            $table->enum('pay_current_month', ['0', '1'])->nullable()->after('terminated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->date('end_contract_vigence_original')->nullable()->after('end_contract_vigence');
            $table->dropColumn('terminated_at');
            $table->dropColumn('pay_current_month');
        });
    }
};
