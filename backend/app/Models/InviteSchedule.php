<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InviteSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'accepted',
        'status',
        'invite_id'
    ];

    protected $casts = [
        'accepted' => 'boolean',
    ];

    public function schedule()
    {
        return $this->belongsTo(JobInterviewInvite::class);
    }
}
