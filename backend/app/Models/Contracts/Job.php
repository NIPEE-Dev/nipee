<?php

namespace App\Models\Contracts;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    public $table = 'contracts_job';

    public $fillable = [
        'role',
        'scholarship_value',
        'scholarship_nominal_value',
        'transport_voucher',
        'transport_voucher_value',
        'transport_voucher_nominal_value',
        'type'
    ];
}