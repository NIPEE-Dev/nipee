<?php

namespace App\Models\Financial;

use Illuminate\Database\Eloquent\Model;

class FinancialCloseCommission extends Model
{
    public $table = 'financial_close_commissions';

    public $fillable = [
        'commission'
    ];
}