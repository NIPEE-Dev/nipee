<?php

namespace App\Models;

use App\Models\Shared\BaseRecord;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentsPreRegistration extends Model
{
    use HasFactory;

    protected $table = 'students_pre_registrations';

    protected $fillable = [
        'full_name',
        'birth_date',
        'email',
        'course',
        'phone',
        'nif',
        'education_level',
        'volunteer_experience',
        'resume',
        'status',
        'status_update',
        'rejection_reason',
        'password_creation_link',
        'approved_at',
        'reject_at',
        'school_id',
        'accepted_terms_at',
        'user_ip',
        'user_agent'
    ];

    protected $dates = [
        'birth_date',
        'approved_at',
        'reject_at',
        'created_at',
        'updated_at',
        'accepted_terms_at',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function course()
    {
        return $this->belongsTo(BaseRecord::class, 'course', 'id'); 
    }    
}
