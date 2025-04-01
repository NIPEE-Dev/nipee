<?php

namespace App\Services\Payment;

use App\API\Payment\Gateways\GatewayFactory;
use App\Enums\Payment\GatewayEnum;
use App\Models\Financial\FinancialCloseCompany;

class PaymentService
{
    public function pay(FinancialCloseCompany $financialCloseCompany)
    {
        $company = $financialCloseCompany->company;
        $paymentGateway = GatewayFactory::make(GatewayEnum::ASAAS, $company);

        $billing = $paymentGateway->createBilling();
        ddApi($billing);
    }
}