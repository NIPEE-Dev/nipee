<?php

use App\Models\Users\User;
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
        Schema::table('companies_billing', function (Blueprint $table) {
            $table->foreignIdFor(User::class, 'seller_id')
                ->after('issue_bank_slip')
                ->nullable()
                ->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('companies_billing', function (Blueprint $table) {
            $table->dropConstrainedForeignIdFor(User::class, 'seller_id');
        });
    }
};
