<?php

use App\Models\Company\Company;
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
        Schema::create('companies_billing', function (Blueprint $table) {
            $table->foreignIdFor(Company::class)->constrained();

            // $table->integer('salesman') foreign key com a tabela de vendedor no futuro
            $table->decimal('colocacao', 10)->nullable();
            $table->decimal('montly_payment', 10)->nullable();
            $table->string('email', 255)->nullable();
            $table->integer('due_date')->nullable();
            $table->enum('business_day', ['0', '1'])->nullable();
            $table->enum('issue_invoice', ['0', '1'])->nullable();
            $table->enum('issue_bank_slip', ['0', '1'])->nullable();

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
        Schema::dropIfExists('companies_billing');
    }
};
