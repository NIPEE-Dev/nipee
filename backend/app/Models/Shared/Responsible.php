<?php

namespace App\Models\Shared;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Responsible extends Model
{
    public $fillable = [
        'name',
        'phone',
        'email',
        'role',
        'document',
        'validade',
        'birth_day'
    ];

    protected function birthDay(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format("d/m/Y"),
            set: fn($value) => empty($value) ? null : Carbon::createFromFormat("d/m/Y", $value),
        );
    }

    public function responsible()
    {
        return $this->morphTo();
    }
}