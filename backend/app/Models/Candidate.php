<?php

namespace App\Models;

use App\Enums\ActiveEnum;
use App\Enums\BaseRecordsEnum;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Enums\GenderEnum;
use App\Enums\InterestEnum;
use App\Enums\PeriodEnum;
use App\Models\Contracts\Contract;
use App\Models\Jobs\Job;
use App\Models\Jobs\JobCandidate;
use App\Models\Shared\Address;
use App\Models\Shared\BaseRecord;
use App\Models\Shared\Contact;
use App\Models\Users\User;
use App\Traits\Common\ActivityLogger;
use App\Traits\Common\HasDocuments;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Candidate extends Model
{
    use SoftDeletes;
    use HasDocuments;
    use ActivityLogger;

    public $fillable = [
        'name',
        'birth_day',
        'cpf',
        'rg',
        'gender',
        'studying_level',
        'mandatory_internship',
        'course',
        'semester',
        'serie',
        'ra',
        'period',
        'interest',
        'piercing',
        'tattoo',
        'smoker',
        'sons',
        'marital_status',
        'how_find_us',
        'how_find_us_name',
        'candidate_observations',
        'tags',
        'hours_fct',
        'volunteer_experience',
        'user_id',
        'resume',
        'rgValidade',
        'hours_remaining',
        'hours_completed'
    ];

    public $casts = [
        'gender' => GenderEnum::class,
        'period' => PeriodEnum::class,
        'interest' => InterestEnum::class,
        'studying_level' => StudyingLevelEnum::class
    ];

   /*  protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('default_candidates', function (Builder $builder) {
            $builder->whereNull('candidatable_type');
        });
    } */

    /**
     * Interact with the user birthday.
     * @return Attribute
     */
    protected function birthDay(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format("d/m/Y"),
            set: fn($value) => Carbon::createFromFormat("d/m/Y", $value),
        );
    }

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function contact(): MorphOne
    {
        return $this->morphOne(Contact::class, 'contactable');
    }

    public function jobs()
    {
        return $this->belongsToMany(Job::class, 'job_candidate')
            ->using(JobCandidate::class)
            ->withPivot(['status'])
            ->withTrashed();
    }

    /**
     * Get the post that owns the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }



    public function contracts()
    {
        return $this->hasMany(Contract::class, 'candidate_id')->withTrashed();
    }

    public function userCourse()
    {
        return $this->belongsTo(BaseRecord::class, 'course')
            ->where('type', '=', BaseRecordsEnum::COURSES->value);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function formattedSerie(): string
    {
        return match ($this->serie) {
            11 => '1° Ano ensino médio regular',
            12 => '2° Ano ensino médio regular',
            13 => '3° Ano ensino médio regular',
            14 => '1° Ano Supletivo',
            15 => '2° Ano Supletivo',
            16 => '3° Ano Supletivo',
            17 => 'Incompleto',
            18 => 'Completo',
            19 => '9ª Ano fundamental (EJA)',
            null => 'Sem série',
            0 => 'Sem série',
            default => 'Série desconhecida',
        };
    }

    public function hasActiveContract()
    {
        return $this
            ->contracts()
            ->withoutTrashed()
            #->where('end_contract_vigence', '>', now())
            ->where('status', '=', ActiveEnum::ACTIVE)
            ->exists();
    }

    public function invites()
    {
        return $this->hasMany(JobInterviewInvite::class);
    }

    public function interviews()
    {
        return $this->belongsToMany(Job::class, 'job_candidate')
            ->withPivot('status')
            ->withTimestamps();
    }
}
