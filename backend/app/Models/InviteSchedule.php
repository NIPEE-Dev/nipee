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
        'invite_id'
    ];

    public function schedule()
    {
        return $this->belongsTo(JobInterviewInvite::class);
    }
}
