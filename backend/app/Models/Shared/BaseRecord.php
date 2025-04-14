<?php

namespace App\Models\Shared;

use App\Enums\BaseRecordsEnum;
use Illuminate\Database\Eloquent\Model;

class BaseRecord extends Model
{
    public $fillable = [
        'type',
        'title'
    ];

    public $casts = [
        'type' => BaseRecordsEnum::class
    ];

    public function informative()
    {
        return $this->morphTo();
    }

    public function schools()
    {
        return $this->belongsToMany(
            School::class,
            'courses_schools',
            'course_id',
            'school_id'
        );
    }
}