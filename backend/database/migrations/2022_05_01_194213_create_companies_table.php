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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            $table->string('fantasy_name', 255);
            $table->string('corporate_name', 255);
            $table->string('cnpj', 18);
            $table->string('municipal_registration', 30)->nullable();
            $table->string('branch_of_activity', 255);

            $table->string('supervisor', 255)->nullable();
            $table->text('observations')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
