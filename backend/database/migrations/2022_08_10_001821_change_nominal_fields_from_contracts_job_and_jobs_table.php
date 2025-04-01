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
        Schema::table('contracts_job', function (Blueprint $table) {
            $table->string('transport_voucher_nominal_value', 255)->change();
            $table->string('scholarship_nominal_value', 255)->change();
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->string('transport_voucher_nominal_value', 255)->change();
            $table->string('scholarship_nominal_value', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts_job', function (Blueprint $table) {
            $table->decimal('transport_voucher_nominal_value')->change();
            $table->decimal('scholarship_nominal_value')->change();
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->decimal('transport_voucher_nominal_value')->change();
            $table->decimal('scholarship_nominal_value')->change();
        });
    }
};
