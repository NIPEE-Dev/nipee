<?php

namespace App\Models;

use App\Models\Shared\Address;
use App\Models\Shared\Contact;
use App\Models\Shared\Responsible;
use App\Models\Users\User;
use App\Models\Shared\BaseRecord;
use App\Traits\Common\ActivityLogger;
use App\Traits\Common\HasDocuments;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use SoftDeletes;
    use HasDocuments;
    use ActivityLogger;

    public $fillable = [
        'fantasy_name',
        'corporate_name',
        'cnpj',
    ];

    public $with = [
        'contact', 'address', 'responsible'
    ];

    public function responsible(): MorphOne
    {
        return $this->morphOne(Responsible::class, 'responsible');
    }

    public function contact(): MorphOne
    {
        return $this->morphOne(Contact::class, 'contactable');
    }

    /**
     * @return BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'school_members', 'school_id', 'user_id')->withTrashed();
    }
 
    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }
    public function courses()
    {
        return $this->belongsToMany(
            BaseRecord::class,
            'courses_schools',
            'school_id',
            'course_id'
        );
    }
}
