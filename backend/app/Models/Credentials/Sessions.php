<?php

namespace App\Models\Credentials;


use Illuminate\Database\Eloquent\Model;

/**
 * Class Sessions
 * @package App\Models\Credentials
 */
class Sessions extends Model
{
    /**
     * @var string
     */
    protected $table = 'sessions';

    /**
     * @var array
     */
    protected $casts = [
        'last_activity' => 'datetime:Y-m-d H:i'
    ];
}