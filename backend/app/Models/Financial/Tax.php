<?php

namespace App\Models\Financial;

use App\Enums\Financial\Company\TaxEnum;
use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tax extends Model
{
    use SoftDeletes;

    public $table = 'companies_tax';

    public $fillable = [
        'company_id',
        'contract_id',
        'type'
    ];

    public $casts = [
        'type' => TaxEnum::class
    ];

    public function company()
    {
        return $this->belongsTo(Company::class)->withTrashed();
    }
}