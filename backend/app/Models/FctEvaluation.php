<?php

namespace App\Models;

use App\Models\Company\Company;
use App\Models\Jobs\Job;
use Illuminate\Database\Eloquent\Model;

class FctEvaluation extends Model
{
    protected $table = 'fct_evaluations';

    protected $fillable = [
        'status',
        'file_path',
        'candidate_id',
        'school_id',
        'company_id',
        'job_id',
        'evaluation',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
