<?php


namespace App\Models;


use App\Models\Users\Roles\Permission;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    public $table = 'menu';

    public function permissions()
    {
        return $this->hasMany(Permission::class, 'menuID');
    }
}
