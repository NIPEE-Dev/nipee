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
        Schema::table('jobs', function (Blueprint $table) {
            $table->decimal('transport_voucher_value')->nullable()->change();
            $table->string('transport_voucher_nominal_value')->nullable()->change();
        });

        Schema::table('contracts_job', function (Blueprint $table) {
            $table->decimal('transport_voucher_value')->nullable()->change();
            $table->string('transport_voucher_nominal_value')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->decimal('transport_voucher_value')->change();
            $table->decimal('transport_voucher_nominal_value')->change();
        });

        Schema::table('contracts_job', function (Blueprint $table) {
            $table->decimal('transport_voucher_value')->change();
            $table->decimal('transport_voucher_nominal_value')->change();
        });
    }
};
