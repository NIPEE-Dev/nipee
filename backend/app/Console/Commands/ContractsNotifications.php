<?php

namespace App\Console\Commands;

use App\Enums\ActiveEnum;
use App\Models\Contracts\Contract;
use Illuminate\Console\Command;

class ContractsNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contracts:notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envia alertas e notificações referente a contratos';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // deve avisar com 11 meses de contrato que no mês seguinte o estagiário deve entrar de férias
        // deve avisar no dia que o estagiário deve entrar de férias

        $contractsBuilder = Contract::query()
            ->setEagerLoads(['company.responsible' => fn($builder) => $builder])
            ->where('status', '=', ActiveEnum::ACTIVE);

        // aviso de 11 meses
        $date = now()->subMonths(11)->format("Y-m-d");
        $rows = $contractsBuilder->clone()->where('start_contract_vigence', '=', $date)->get();
        dump(2, $date, $rows);

        // aviso de férias começando
        $date = now()->subMonths(12)->format("Y-m-d");
        $rows = $contractsBuilder->clone()->where('start_contract_vigence', '=', $date)->get();
        dump(3, $date, $rows);

        return self::SUCCESS;
    }
}
