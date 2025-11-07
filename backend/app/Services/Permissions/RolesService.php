<?php

namespace App\Services\Permissions;


use App\Models\Users\Roles\Role;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class RolesRepository
 * @package App\Repositories\Credentials
 */
class RolesService
{
    /**
     * @param array $params
     * @return Role[]|\Illuminate\Database\Eloquent\Collection|mixed
     */
    public function data(array $params = [])
    {
        $data['table'] = Role::all();

        return $data;
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function store(array $data): Role
    {
        DB::beginTransaction();

        $role = tap(Role::create($data), function (Role $role) use ($data) {
            $role->permissions()->sync($data['permissions']);
            return $role;
        });

        DB::commit();

        return $role;
    }

    /**
     * @param Role $role
     * @param array $data
     */
    public function update(Role $role, array $data): Role
    {
        DB::beginTransaction();

        $role->fill($data);
        $role->touch('updated_at');
        $role->save();
        $role->permissions()->sync(collect($data['permissions'])->filter(fn($permission) => is_numeric($permission) && (int)$permission > 0));

        DB::commit();

        return $role;
    }

    public function sync(Collection $menus) {}
}
