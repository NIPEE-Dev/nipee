<?php

namespace App\Models\Users\Roles;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Role
 * @package App\Models\Users\Roles
 */
class Role extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * @var array
     */
    protected $fillable = [
        'title',
        'updated_at'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withTrashed();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }
}
