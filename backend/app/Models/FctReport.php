<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FctReport extends Model
{
    protected $table = 'fct_reports';

    protected $fillable = [
        'candidate_name',
        'company_name',
        'total_hours',
        'report',
        'sent_date',
        'candidate_id',
        'school_id',
        'company_id',
    ];
}
