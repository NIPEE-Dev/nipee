<?php

use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Contracts\Contract;
use App\Models\Jobs\Job;
use App\Models\School;
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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Job::class);
            $table->foreignIdFor(Company::class);
            $table->foreignIdFor(School::class);
            $table->foreignIdFor(Candidate::class);

            $table->string('supervisor', 255);
            $table->date('start_contract_vigence');
            $table->date('end_contract_vigence');
            $table->enum('retroative_billing', ['0', '1']);
            $table->enum('recolocation', ['0', '1']);

            $table->date('insurance_date');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('contracts_job', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Contract::class);

            $table->string('role', 255);
            $table->decimal('scholarship_value');
            $table->decimal('scholarship_nominal_value');
            $table->enum('transport_voucher', ['0', '1']);
            $table->decimal('transport_voucher_value');
            $table->decimal('transport_voucher_nominal_value');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('contracts_job_working_day', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Contract::class);

            $table->tinyInteger('start_weekday');
            $table->tinyInteger('end_weekday');
            $table->time('start_hour');
            $table->time('end_hour');

            $table->tinyInteger('day_off_start_weekday');
            $table->time('day_off_start_hour');
            $table->time('day_off_end_hour');

            $table->string('day_off');
            $table->integer('working_hours');

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
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('contracts_job');
        Schema::dropIfExists('contracts_job_working_day');
    }
};
