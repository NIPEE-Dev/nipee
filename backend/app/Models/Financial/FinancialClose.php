<?php

namespace App\Models\Financial;

use App\Enums\Financial\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinancialClose extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $fillable = [
        'reference_date',
        'status',
        'total_value',
    ];

    public $casts = [
        'reference_date' => 'datetime',
        'status' => StatusEnum::class,
        'total_value' => 'decimal:2',
    ];

    public function companies(): HasMany
    {
        return $this->hasMany(FinancialCloseCompany::class);
    }

    public function totalFinancialCloseValue(): float
    {
        $total = $this->companies->sum(function ($company) {
            return $company->totalValue();
        });

        $this->update(['total_value' => $total]);

        return $total;
    }

    public function buildCommission(): array
    {
        $commissions = [];
        $companies = [];

        $userPermissions = user()->permissions();
        $this->companies->map(
            function (FinancialCloseCompany $company) use (&$commissions, &$companies, $userPermissions) {
                $seller = $company->company->billing->seller;
                $sellerName = $seller->name;
                if (!in_array('financial-close.commission-all', $userPermissions) && user()->name !== $sellerName) {
                    return $company;
                }

                $commission = $company->calculateCommission();
                if (isset($commissions[$sellerName])) {
                    $commissions[$sellerName] += $commission;
                } else {
                    $commissions[$sellerName] = $commission;
                }

                $companies[] = [
                    'company_id' => $company->id,
                    'seller' => $sellerName,
                    'seller_id' => $seller->id,
                    'commission' => $commission,
                    'percentCommission' => (float)$seller->commission
                ];
                return $company;
            }
        );

        return [
            'total' => array_sum($commissions),
            'companies' => $companies,
            'rows' => collect($commissions)->map(fn($value, $key) => [
                'name' => $key,
                'value' => $value
            ])->values()
        ];
    }
}
