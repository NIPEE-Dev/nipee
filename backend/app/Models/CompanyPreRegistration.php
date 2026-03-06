<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyPreRegistration extends Model
{
    use HasFactory;

    protected $table = 'company_pre_registrations';

    protected $fillable = [
        'company_name',
        'nif',
        'representative_name',
        'corporate_email',
        'phone',
        'sector',
        'student_vacancies',
        'message',
        'status',
        'rejection_reason',
        'commercial_registration',
        'line_business',
        'cae',
        'status_update',
        'password_creation_link',
        'approved_at',
        'reject_at',
        'accepted_terms_at',
        'user_ip',
        'user_agent'
    ];

    protected $dates = [
        'approved_at',
        'reject_at',
        'created_at',
        'updated_at',
        'accepted_terms_at',
    ];
}
