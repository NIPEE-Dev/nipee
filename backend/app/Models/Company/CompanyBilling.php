<?php

namespace App\Models\Company;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyBilling extends Model
{
    //use ActivityLogger;
    public $table = 'companies_billing';

    public $fillable = [
        'colocacao',
        'monthly_payment',
        'email',
        'due_date',
        'business_day',
        'issue_invoice',
        'issue_bank_slip',
        'seller_id'
    ];

    /**
     * Interact with total value.
     * @return Attribute
     */
    protected function colocacao(): Attribute
    {
        return Attribute::make(
            set: fn($value) => maskToFloat($value),
        );
    }

    /**
     * Interact with total value.
     * @return Attribute
     */
    protected function monthlyPayment(): Attribute
    {
        return Attribute::make(
            set: fn($value) => maskToFloat($value),
        );
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id')->withTrashed();
    }
}