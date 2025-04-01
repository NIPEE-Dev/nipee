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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Company::class);
            $table->bigInteger('role_id');
            $table->char('period');
            $table->enum('gender', ['F', 'M']);
            $table->enum('transport_voucher', ['0', '1']);
            $table->decimal('transport_voucher_value');
            $table->decimal('transport_voucher_nominal_value');
            $table->decimal('scholarship_value');
            $table->decimal('scholarship_nominal_value');
            $table->tinyInteger('available');
            $table->enum('type', ['ES', 'EF']);
            $table->enum('show_web', ['0', '1']);

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
        Schema::dropIfExists('jobs');
    }
};
