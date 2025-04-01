<?php

use App\Models\Financial\FinancialCloseItems;
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
        Schema::create('financial_close_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(FinancialCloseItems::class);

            $table->decimal('commission', unsigned: true);

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
        Schema::dropIfExists('financial_close_commissions');
    }
};
