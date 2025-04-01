<?php

namespace App\Models\Users\Roles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Permission
 * @package App\Models
 */
class Permission extends Model
{
    use HasFactory;

    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'description'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class)->withTrashed();
    }
}
