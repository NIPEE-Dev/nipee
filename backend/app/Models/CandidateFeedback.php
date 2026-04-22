<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateFeedback extends Model
{
    use HasFactory;
    public $fillable = [
        'annotation',
        'candidate_id',
    ];
}
