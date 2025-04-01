<?php

namespace App\Models\Insurance;

use App\Traits\Common\ActivityLogger;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use ActivityLogger;

    public $table = 'insurance_settings';
    public $fillable = [
        'apolice',
        'subestipulante',
    ];
}