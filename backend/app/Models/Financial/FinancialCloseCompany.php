<?php

namespace App\Models\Financial;

use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialCloseCompany extends Model
{
    use HasFactory;

    public $fillable = [
        'company_id',
    ];

    public function financialClose()
    {
        return $this->belongsTo(FinancialClose::class)->withTrashed();
    }

    public function items(): HasMany
    {
        return $this->hasMany(FinancialCloseItems::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id')->withTrashed();
    }

    public function calculateCommission(): float
    {
        $sellerCommissionPercent = (float)$this->company->billing->seller->commission;
        $value = $this->totalValue();
        return ($value / 100) * $sellerCommissionPercent;
    }

    public function totalValue(): float
    {
        if ($this->relationLoaded('items')) {
            return $this->items->sum('value');
        }

        return $this->items()->sum('value');
    }
}
