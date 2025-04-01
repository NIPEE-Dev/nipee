<?php

namespace App\Enums\Financial\Company;

use App\Models\Company\CompanyBilling;

enum TaxEnum: string
{
    case ACCESSION = '0';
    case MONTHLY_PAYMENT = '1';
    case RECOLOCATION = '2';
    case MONTHLY_PAYMENT_RETROATIVE = '3';

    public static function getValueByTax(self $tax, CompanyBilling $companyBilling)
    {
        return match ($tax) {
            TaxEnum::ACCESSION => $companyBilling->colocacao,
            TaxEnum::MONTHLY_PAYMENT_RETROATIVE, TaxEnum::MONTHLY_PAYMENT => $companyBilling->monthly_payment,
            TaxEnum::RECOLOCATION => 0,
        };
    }

    public static function getLabel(self $type)
    {
        return match ($type) {
            TaxEnum::ACCESSION => 'Adesão',
            TaxEnum::MONTHLY_PAYMENT => 'Mensalidade',
            TaxEnum::RECOLOCATION => 'Recolocação',
            TaxEnum::MONTHLY_PAYMENT_RETROATIVE => 'Mensalidade retroativa',
        };
    }

}