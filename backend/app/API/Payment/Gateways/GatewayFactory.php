<?php

namespace App\API\Payment\Gateways;

use App\Enums\Payment\GatewayEnum;
use App\Models\Company\Company;

class GatewayFactory
{
    public static function make(GatewayEnum $gatewayEnum, Company $company): IPaymentGateway
    {
        return match ($gatewayEnum) {
            GatewayEnum::ASAAS => resolve(AsaasGateway::class, ['company' => $company])
        };
    }
}