<?php

namespace App\Models\Jobs;

use App\Enums\BaseRecordsEnum;
use App\Enums\BooleanEnum;
use App\Enums\GenderEnum;
use App\Enums\PeriodEnum;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Contracts\Contract;
use App\Models\Shared\BaseRecord;
use App\Traits\Common\ActivityLogger;
use App\Traits\Common\HasDocuments;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use SoftDeletes;
    use HasDocuments;
    use ActivityLogger;

    public $fillable = [
        'company_id',
        'role_id',
        'period',
        'gender',
        'transport_voucher',
        'transport_voucher_value',
        'meal_voucher',
        'transport_voucher_nominal_value',
        'scholarship_value',
        'scholarship_nominal_value',
        'available',
        'type',
        'show_web',
        'description'
    ];

    public $casts = [
        'gender' => GenderEnum::class,
        'show_web' => BooleanEnum::class,
        'period' => PeriodEnum::class,
    ];

    protected function transportVoucherValue(): Attribute
    {
        return Attribute::make(
            set: fn($value) => maskToFloat($value),
        );
    }

    protected function scholarshipValue(): Attribute
    {
        return Attribute::make(
            set: fn($value) => maskToFloat($value),
        );
    }

    public function workingDay()
    {
        return $this->hasOne(JobWorkingDay::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class)->withTrashed();
    }

    public function candidates()
    {
        return $this
            ->belongsToMany(Candidate::class, 'job_candidate')
            ->using(JobCandidate::class)
            ->withPivot(['status', 'created_at', 'updated_at'])
            ->withTrashed();
    }

    public function role()
    {
        return $this->hasOne(BaseRecord::class, 'id', 'role_id')->where('type', '=', BaseRecordsEnum::ROLES->value);
    }

    public function history()
    {
        return $this->hasMany(JobHistory::class, 'job_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'job_id');
    }
}
