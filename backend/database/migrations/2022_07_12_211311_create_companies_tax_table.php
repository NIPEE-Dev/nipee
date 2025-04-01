<?php

use App\Models\Company\Company;
use App\Models\Contracts\Contract;
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
        Schema::create('companies_tax', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Company::class);
            $table->foreignIdFor(Contract::class)->nullable();

            $table->enum('type', ['0', '1', '2']);

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
        Schema::dropIfExists('companies_tax');
    }
};
