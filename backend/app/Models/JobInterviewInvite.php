<?php

namespace App\Models;

use App\Models\Jobs\Job;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobInterviewInvite extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'status',
        'message',
        'candidate_id',
        'interview_evaluation'
    ];

    public function schedule()
    {
        return $this->hasMany(InviteSchedule::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
