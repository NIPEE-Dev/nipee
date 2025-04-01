<?php

namespace App\Services\Financial;

use App\Enums\ActiveEnum;
use App\Enums\Financial\Company\TaxEnum;
use App\Models\Contracts\Contract;
use App\Models\Financial\FinancialClose;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class FinancialCloseProcess
{
    private $currentProcessingCompany;

    public function process(FinancialClose $financialClose): void
    {
        $companiesContracts = $this->getCompaniesContracts($financialClose);

        foreach ($companiesContracts as $companyId => $companyContracts) {
            $this->createCompanyGroup($financialClose, $companyId);
            $this->handleTax($financialClose);

            /** @var Contract $contract */
            foreach ($companyContracts as $contract) {
                if ($contract->shouldPayRetroactive()) {
                    $this->payRetroactive($contract, $financialClose);
                }

                if ($contract->isActive()) {
                    $this->createCompanyGroupRow($contract, $financialClose);
                }
            }

            $this->currentProcessingCompany->save();
        }
    }

    /**
     * @param FinancialClose $financialClose
     * @return Builder[]|\Illuminate\Database\Eloquent\Collection|Collection
     */
    private function getCompaniesContracts(FinancialClose $financialClose)
    {
        $allContracts = Contract::query()
            ->withTrashed()
            ->with('company.billing.seller')
            ->where(function (Builder $builder) {
                $builder->where('status', '=', ActiveEnum::ACTIVE)
                    ->orWhereHas('tax', function (Builder $builder) {
                        $builder->where('type', "!=", TaxEnum::RECOLOCATION);
                    });
            })
            ->get();

        return $allContracts->groupBy('company_id');
    }

    /**
     * @param FinancialClose $financialClose
     * @param int $companyId
     * @return void
     */
    private function createCompanyGroup(FinancialClose $financialClose, int $companyId): void
    {
        $this->currentProcessingCompany = $financialClose->companies()->create([
            'company_id' => $companyId,
        ]);
    }

    /**
     * @param FinancialClose $financialClose
     * @return void
     */
    private function handleTax(FinancialClose $financialClose): void
    {
        if ($taxes = $this->currentProcessingCompany->company->tax) {
            /**
             * @var \Illuminate\Database\Eloquent\Collection $recolocationTax
             */
            [$recolocationTax, $othersTax] = $taxes->partition(function ($tax) {
                return $tax->type === TaxEnum::RECOLOCATION;
            });

            foreach ($othersTax as $otherTax) {
                $availableRecolocations = $recolocationTax->where('contract_id', '!=', $otherTax->contract_id);

                if ($otherTax->type === TaxEnum::ACCESSION && $availableRecolocations->count()) {
                    $recolocation = $availableRecolocations->shift();
                    $recolocationTax = $availableRecolocations->values();

                    $this->currentProcessingCompany->items()->create([
                        'type' => TaxEnum::RECOLOCATION,
                        'value' => 0,
                        'contract_id' => $otherTax->contract_id,
                        'start_date' => $financialClose->reference_date->format("d-m-Y H:i:s"),
                    ]);

                    $recolocation->delete();
                    $otherTax->delete();
                    continue;
                }

                $this->currentProcessingCompany->items()->create([
                    'type' => $otherTax->type,
                    'value' => $this->getValueByTax($otherTax->type),
                    'contract_id' => $otherTax->contract_id,
                    'start_date' => $financialClose->reference_date->format("d-m-Y H:i:s"),
                ]);

                $otherTax->delete();
            }
        }
    }

    /**
     * @param mixed $contract
     * @param FinancialClose $financialClose
     * @return void
     */
    private function payRetroactive(mixed $contract, FinancialClose $financialClose): void
    {
        $periods = Carbon::parse($contract->start_contract_vigence)
            ->toPeriod($financialClose->reference_date->subMonth()->endOfMonth(), 1, 'months');

        // tem casos que eles colocam pra pagar retroativamente contratos criados no mes anterior (mesmo após fechamento)
        // então na linha acima, quando faz o subMonth e calcula o periodo, acaba ficando sem nenhum mes e consequentemente
        // não fazendo a cobrança retroativa do mes passado
        $periodsCount = $periods->count() === 0 ? 1 : $periods->count();
        $startDate = now()->subMonth();
        if ($periods->count() > 0) {
            $startDate = $periods->first();
        }

        $this->currentProcessingCompany->items()->create([
            'contract_id' => $contract->id,
            'type' => TaxEnum::MONTHLY_PAYMENT_RETROATIVE,
            'value' => $this->getValueByTax(TaxEnum::MONTHLY_PAYMENT_RETROATIVE) * $periodsCount,
            'start_date' => $startDate->format("d-m-Y H:i:s"),
            'end_date' => $periods->count() > 1 ? $periods->last()->format("d-m-Y H:i:s") : null
        ]);
    }

    /**
     * @param mixed $contract
     * @param FinancialClose $financialClose
     * @return void
     */
    private function createCompanyGroupRow(mixed $contract, FinancialClose $financialClose): void
    {
        $this->currentProcessingCompany->items()->create([
            'contract_id' => $contract->id,
            'type' => TaxEnum::MONTHLY_PAYMENT,
            'value' => $this->getValueByTax(TaxEnum::MONTHLY_PAYMENT),
            'start_date' => $financialClose->reference_date->format("d-m-Y H:i:s"),
        ]);
    }

    private function getValueByTax(TaxEnum $taxEnum): float
    {
        return (float)TaxEnum::getValueByTax($taxEnum, $this->currentProcessingCompany->company->billing);
    }

}