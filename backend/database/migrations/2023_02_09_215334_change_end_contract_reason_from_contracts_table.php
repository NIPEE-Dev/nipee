<?php

use App\Models\Shared\BaseRecord;
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
        Schema::table('contracts', function (Blueprint $table) {
            $table->foreignIdFor(BaseRecord::class, 'end_contract_reason_id')
                ->nullable()
                ->after('end_contract_vigence_original')
                ->constrained('base_records');
            $table->dropColumn('end_contract_reason');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropConstrainedForeignIdFor(BaseRecord::class, 'end_contract_reason_id');
            $table->string('end_contract_reason')->nullable()->after('end_contract_vigence_original');
        });
    }
};
