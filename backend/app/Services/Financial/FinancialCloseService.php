<?php

namespace App\Services\Financial;

use App\Enums\Financial\StatusEnum;
use App\Models\Financial\FinancialClose;
use App\Models\Financial\FinancialCloseCompany;
use App\Models\Financial\FinancialCloseItems;
use App\Services\Payment\PaymentService;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Mpdf\Mpdf;

class FinancialCloseService
{
    use Filterable;


    public function __construct(private FinancialCloseProcess $financialCloseProcess)
    {
    }

    public function index($criteria)
    {
        //se deixar com eager loading da erro 500 por estouro de memória
        //return $this->applyCriteria($this->load(FinancialClose::query()->latest(), 'with'), $criteria)
        return $this->applyCriteria(FinancialClose::query()->latest(), $criteria)
            ->paginate(Arr::get($criteria, 'perPage', 10));
    }

    public function store($data)
    {
        return DB::transaction(function () use ($data) {
            $data['status'] = StatusEnum::DRAFT;
            return tap(FinancialClose::create($data), function (FinancialClose $financialClose) {
                $this->financialCloseProcess->process($financialClose);
            });
        });
    }

    public function generatePayment(FinancialClose $financialClose)
    {
        /**
         * @var PaymentService $paymentService
         */
        $paymentService = resolve(PaymentService::class);
        foreach ($financialClose->companies as $company) {
            $paymentService->pay($company);
        }
    }

    public function discriminatingDownload(FinancialCloseCompany $financialCloseCompany)
    {
        $view = view('financial-close.' . config('app.system_identifier'), ['financialCloseCompany' => $financialCloseCompany->load('items.contract.candidate')]);

        $mpdf = new Mpdf(['orientation' => 'L']);
        $mpdf->WriteHTML($view);
        return $mpdf->Output('Espelho de fatura', 'I');
    }

    public function updateRowValue(FinancialCloseItems $financialCloseItems, $value): FinancialCloseItems
    {
        $financialCloseItems->update(['value' => $value]);
        return $financialCloseItems;
    }

    public function load(FinancialClose|Builder $financialClose, string $loader = 'load')
    {
        return $financialClose->{$loader}([
            'companies' => [
                'items' => [
                    'contract' => [
                        'candidate'
                    ],
                ],
                'company' => [
                    'billing' => [
                        'seller'
                    ]
                ],
            ]
        ]);
    }
}