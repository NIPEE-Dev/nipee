<?php

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
        Schema::dropIfExists('financial_close_commissions');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('financial_close_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(FinancialCloseCompany::class);

            $table->decimal('commission', unsigned: true);

            $table->timestamps();
        });
    }
};
