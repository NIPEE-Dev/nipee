<?php

namespace App\Models\Activities;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    use HasFactory;

    protected $table = 'activities';

    public $fillable = [
        'user_id',
        'title',
        'description',
        'estimated_time',
        'status',
        'activity_date',
        'justification',
        'justificated_at',
        'job_id',
        'has_absence',
        'absence_description',
        'absence_file',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public $casts = [
        'has_absencee' => 'boolean'
    ];
}
