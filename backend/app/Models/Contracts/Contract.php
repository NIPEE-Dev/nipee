<?php

namespace App\Models\Contracts;

use App\Enums\ActiveEnum;
use App\Enums\BaseRecordsEnum;
use App\Enums\Financial\Company\TaxEnum;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Financial\FinancialCloseItems;
use App\Models\Financial\Tax;
use App\Models\School;
use App\Models\Shared\Address;
use App\Models\Shared\BaseRecord;
use App\Traits\Common\ActivityLogger;
use App\Traits\Common\CrudUpdating;
use App\Traits\Common\HasDocuments;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;
    use HasDocuments;
    use CrudUpdating;
    use ActivityLogger;

    public $table = 'contracts';

    public $fillable = [
        'job_id',
        'company_id',
        'school_id',
        'candidate_id',

        'supervisor',
        'funcao',
        'start_contract_vigence',
        'end_contract_vigence',
        'end_contract_vigence_original',
        'end_contract_reason',
        'retroative_billing',
        'recolocation',
        'insurance_date',
        'status',
        'end_contract_reason_id',
        'pay_current_month',
        'terminated_at',
        'school_signature',
        'school_signature_path',
        'company_signature',
        'company_signature_path',
    ];

    public $casts = [
        'start_contract_vigence' => 'datetime:d/m/Y',
        'end_contract_vigence' => 'datetime:d/m/Y',
        'end_contract_vigence_original' => 'datetime:d/m/Y',
        'terminated_at' => 'datetime:d/m/Y',
        'status' => ActiveEnum::class,
        'deleted' => ActiveEnum::class,
        'pay_current_month' => 'boolean',
        'retroative_billing' => 'boolean',
        'recolocation' => 'boolean',
    ];

    public $with = [
        'originalJob', 'job', 'workingDay', 'company.address', 'candidate.school'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class)->withTrashed();
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class)->withTrashed();
    }

    public function candidate(): MorphOne
    {
        return $this->morphOne(Candidate::class, 'candidatable')->withoutGlobalScope('default_candidates')->withTrashed();
    }

    public function userAddress(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')->where('custom_type', '=', 'userAddress');
    }

    public function jobOtherAddress(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')->where('custom_type', '=', 'jobOtherAddress');
    }

    public function originalJob(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Jobs\Job::class, 'job_id')->withTrashed();
    }

    public function job(): HasOne
    {
        return $this->hasOne(Job::class);
    }

    public function workingDay(): HasOne
    {
        return $this->hasOne(WorkingDay::class);
    }

    public function financialCloseItems(): HasMany
    {
        return $this->hasMany(FinancialCloseItems::class);
    }

    public function reasonForTermination(): HasOne
    {
        return $this->hasOne(BaseRecord::class, 'id', 'end_contract_reason_id')->where('type', '=', BaseRecordsEnum::REASON_FOR_EXIT);
    }

    public function tax(): HasMany
    {
        return $this->hasMany(Tax::class);
    }

    public function isTerminated(): bool
    {
        return $this->terminated_at !== null;
    }

    public function shouldPayRetroactive(): bool
    {
        return $this->retroative_billing
            && $this->financialCloseItems()
                ->withTrashed()
                ->where('type', '=', TaxEnum::MONTHLY_PAYMENT_RETROATIVE)
                ->doesntExist();
    }

    public function isActive(): bool
    {
        return $this->status === ActiveEnum::ACTIVE;
    }

    public function reactive()
    {
        $this->update([
            'status' => ActiveEnum::ACTIVE,
            'terminated_at' => null,
            'end_contract_reason_id' => null,
            'pay_current_month' => null
        ]);
    }
}