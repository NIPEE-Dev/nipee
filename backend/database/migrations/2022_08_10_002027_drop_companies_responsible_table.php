<?php

use App\Models\Company\Company;
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
        Schema::dropIfExists('companies_responsible');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('companies_responsible', function (Blueprint $table) {
            $table->foreignIdFor(Company::class);

            $table->string('name', 255)->nullable();
            $table->string('phone', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('role', 255)->nullable();
            $table->string('rg', 255)->nullable();
            $table->date('birth_day')->nullable();

            $table->timestamps();
        });
    }
};
