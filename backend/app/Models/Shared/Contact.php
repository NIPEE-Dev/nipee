<?php

namespace App\Models\Shared;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    public $fillable = [
        'name',
        'phone',
        'cellphone',
        'email',
        'role',
        'talk_to',
    ];

    public function contactable()
    {
        return $this->morphTo();
    }
}