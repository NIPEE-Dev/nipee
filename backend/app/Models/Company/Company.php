<?php

namespace App\Models\Company;

use App\Enums\Company\TypeEnum;
use App\Models\Financial\Tax;
use App\Models\Shared\Address;
use App\Models\Shared\Contact;
use App\Models\Shared\Responsible;
use App\Models\Users\User;
use App\Traits\Common\ActivityLogger;
use App\Traits\Common\HasDocuments;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use ActivityLogger;
    use SoftDeletes;
    use HasDocuments;

    public $fillable = [
        'fantasy_name',
        'corporate_name',
        'type',
        'cnpj',
        'cpf',
        'oab',
        'crcsp',
        'municipal_registration',
        'branch_of_activity',
        'supervisor',
        'observations',
        'start_contract_vigence',
        'cae',
        'sector',
        'user_id',
        'asaas_id',
    ];

    public $casts = [
        'type' => TypeEnum::class
    ];

    public function billing(): HasOne
    {
        return $this->hasOne(CompanyBilling::class);
    }

    public function responsible(): MorphOne
    {
        return $this->morphOne(Responsible::class, 'responsible');
    }

    public function contact(): MorphOne
    {
        return $this->morphOne(Contact::class, 'contactable');
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function tax(): HasMany
    {
        return $this->hasMany(Tax::class);
    }

    public function hasAsaasId()
    {
        return $this->asaas_id !== null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
