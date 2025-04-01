<?php

namespace App\Models\Financial;

use App\Enums\Financial\Company\TaxEnum;
use App\Models\Contracts\Contract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinancialCloseItems extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $fillable = [
        'contract_id',
        'type',
        'value',
        'start_date',
        'end_date',
    ];

    public $casts = [
        'type' => TaxEnum::class,
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function financialCompany(): BelongsTo
    {
        return $this->belongsTo(FinancialCloseCompany::class, 'financial_close_company_id');
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class, 'contract_id')->withTrashed();
    }
}
