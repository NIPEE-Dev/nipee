<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInsuranceFieldsToContractsTable extends Migration
{
    public function up()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->boolean('has_insurance')->default(false)->before('insurance_date');
            $table->string('insurance_number')->nullable()->before('insurance_date');
        });
    }

    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('has_insurance');
            $table->dropColumn('insurance_number');
        });
    }
}
