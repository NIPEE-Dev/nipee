<?php

namespace App\API\Payment\Gateways;

interface IPaymentGateway
{

    public function createBilling();
}