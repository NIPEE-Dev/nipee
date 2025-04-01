<?php

use App\Models\Company\Company;
use App\Models\Financial\FinancialClose;
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
        Schema::create('financial_close_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(FinancialClose::class);
            $table->foreignIdFor(Company::class);

            $table->decimal('total_value', 20);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('financial_close_companies');
    }
};
