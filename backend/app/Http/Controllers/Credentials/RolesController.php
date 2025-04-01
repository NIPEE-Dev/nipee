<?php

namespace App\Http\Controllers\Credentials;


use App\Http\Controllers\Controller;
use App\Http\Requests\Credentials\RoleRequest;
use App\Http\Resources\Permissions\RoleResource;
use App\Http\Resources\Permissions\RolesCollection;
use App\Models\Users\Roles\Role;
use App\Services\Permissions\RolesService;
use App\Services\Permissions\RoleTreeService;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Contracts\Container\CircularDependencyException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class RolesController
 * @package App\Http\Controllers\Credentials
 */
class RolesController extends Controller
{

    /**
     * UsersController constructor.
     */
    public function __construct(private readonly RolesService $rolesService)
    {
    }

    /**
     * @return RolesCollection|JsonResource
     */
    public function index(Request $request)
    {
        if ($request->has('tree')) {
            return $this->tree();
        }

        return new RolesCollection(Role::query()->paginate(request()->get('perPage', 10)));
    }

    /**
     * @param RoleRequest $request
     * @return RoleResource
     * @throws BindingResolutionException
     * @throws CircularDependencyException
     */
    public function store(RoleRequest $request)
    {
        $role = $this->rolesService->store($request->all());
        $role->enabledPermissions = $request->post('permissions');
        $role->tree = resolve(RoleTreeService::class)->build();
        return new RoleResource($role);
    }

    /**
     * @param int $id
     * @param RoleTreeService $menuService
     * @return RoleResource
     */
    public function show(Role $role)
    {
        $role->enabledPermissions = $role->permissions()->pluck('permissions.id');
        $role->tree = resolve(RoleTreeService::class)->build();

        return new RoleResource($role);
    }

    public function tree(): JsonResource
    {
        return new JsonResource(resolve(RoleTreeService::class)->build());
    }

    /**
     * @param Role $role
     * @param RoleRequest $request
     * @return RoleResource
     */
    public function update(Role $role, RoleRequest $request)
    {
        return new RoleResource($this->rolesService->update($role, $request->all()));
    }

    /**
     * @param Role $role
     * @return RoleResource
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return new RoleResource($role);
    }
}
