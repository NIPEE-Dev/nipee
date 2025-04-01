<?php

use App\Models\Contracts\Contract;
use App\Models\Financial\FinancialCloseCompany;
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
        Schema::create('financial_close_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(FinancialCloseCompany::class);
            $table->foreignIdFor(Contract::class);

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
        Schema::dropIfExists('financial_close_items');
    }
};
