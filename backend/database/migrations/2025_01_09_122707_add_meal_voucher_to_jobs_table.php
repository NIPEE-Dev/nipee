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
        Schema::table('jobs', function (Blueprint $table) {
            $table->decimal('meal_voucher', 8, 2)->after('transport_voucher_nominal_value')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn('meal_voucher');
        });
    }
    
};
