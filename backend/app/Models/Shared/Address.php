<?php

namespace App\Models\Shared;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    public $fillable = [
        'cep',
        'uf',
        'city',
        'address',
        'district',
        'number',
        'complement',
        'custom_type'
    ];

    public function addressable()
    {
        return $this->morphTo();
    }
}