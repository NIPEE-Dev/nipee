<?php

namespace App\Console\Commands;

use App\Beans\MailTask;
use App\Enums\ActiveEnum;
use App\Jobs\SendMail;
use App\Mail\EndContractNotification;
use App\Mail\VacationNotification;
use App\Models\Contracts\Contract;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CommonAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contracts:common-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envia um e-mail avisando que estagiarios vão entrar de férias ou terão seus contratos terminados';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $builder = Contract::query()
            ->without('originalJob', 'job', 'workingDay', 'company.address', 'candidate.school')
            ->with(['company.responsible', 'candidate'])
            ->where('status', '=', ActiveEnum::ACTIVE);

        $vacations = $builder->clone()
            ->whereRaw("
                (
                    DATE_FORMAT(NOW(), '%m-%d') = DATE_FORMAT(DATE_ADD(start_contract_vigence, INTERVAL 11 MONTH), '%m-%d')
                    OR DATE_FORMAT(NOW(), '%m-%d') = DATE_FORMAT(DATE_SUB(DATE_ADD(start_contract_vigence, INTERVAL 11 MONTH), INTERVAL 1 WEEK), '%m-%d')
                )
            ")->get();

        $endContracts = $builder->clone()
            ->whereRaw("
                (
                    DATE_FORMAT(NOW(), '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(end_contract_vigence, INTERVAL 1 MONTH), '%Y-%m-%d')
                    OR DATE_FORMAT(NOW(), '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(end_contract_vigence, INTERVAL 1 WEEK), '%Y-%m-%d')
                )
            ")->get();


        $bcc = config('app.system_identifier') === 'guarulhos' ? 'cadastro@brilhoestagio.com.br' : 'brilholeste@brilhoestagio.com.br';
        foreach ($vacations as $contract) {
            $responsibleEmail = $contract->company->responsible->email;

            SendMail::dispatch(
                new MailTask(
                    $responsibleEmail ?? $bcc,
                    new VacationNotification($contract->candidate->name, Carbon::parse($contract->start_contract_vigence)->addMonths(12)->format("d/m/Y")),
                    $bcc
                )
            );
        }

        foreach ($endContracts as $contract) {
            $responsibleEmail = $contract->company->responsible->email;

            SendMail::dispatch(
                new MailTask(
                    $responsibleEmail ?? $bcc,
                    new EndContractNotification($contract->candidate->name, $contract->end_contract_vigence->format("d/m/Y")),
                    $bcc
                )
            );
        }

        return self::SUCCESS;
    }
}
