<?php

namespace App\Models\Users;

use App\Models\Activities\Activity;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Credentials\Sessions;
use App\Models\School;
use App\Models\Users\Roles\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'role_id',
        'name',
        'email',
        'password',
        'commission',
        'start_hour',
        'end_hour',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @return BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class)->withTrashed();
    }

    /**
     * @return HasOne
     */
    public function company()
    {
        return $this->hasOne(Company::class)->withTrashed();
    }

    /**
     * @return HasOne
     */
    public function candidate()
    {
        return $this->hasOne(Candidate::class)->withTrashed();
    }

    /**
     * @return BelongsToMany
     */
    public function school()
    {
        return $this->belongsToMany(School::class, 'school_members', 'user_id', 'school_id')->withTrashed();
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    /*   public function permissions(): array
      {
          return user()->roles()->first()?->permissions()?->pluck('slug')->toArray() ?? [];
      } */

    // User.php
    public function permissions(): array
    {
        return $this->roles()->with('permissions')->get()->pluck('permissions')->flatten()->pluck('slug')->toArray();
    }

    /**
     * @return HasMany
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Sessions::class)->latest('last_activity');
    }

    public function isSysAdmin(): bool
    {
        return $this->roles->first()->title === 'SysAdmin';
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
