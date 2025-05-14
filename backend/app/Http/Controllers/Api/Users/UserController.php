<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\UserRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\Users\User;
use App\Services\Users\UsersServices;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(
        private UsersServices $usersServices
    )
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return UserResource::collection($this->usersServices->index($request->all()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return UserResource
     */
    public function store(UserRequest $request)
    {
        return new UserResource($this->usersServices->store($request->all()));
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return UserResource
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param User $user
     * @return UserResource
     */
    public function update(UserRequest $request, User $user)
    {
        $data = $request->all();
        if ($password = Arr::get($data, 'password')) {
            $data['password'] = Hash::make($password);
        }

        if ($role = Arr::get($data, 'role')) {
            $user->roles()->sync([$role]);
        }

        $user->update($data);
        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return Response
     */
    public function destroy(User $user)
    {
        $user->delete();
    }

    public function getNIF(Request $request)
{
    // Get current user
    $user = Auth::user() ?? null;
    \Log::info('User:', ['user' => $user]);  // Log the user object
    
    // Get user role
    $role = $user->role_id ?? null;
    \Log::info('User Role:', ['role_id' => $role]);  // Log the role

    // Escola
    if ($role == 10) {
        $nif = $user->school?->responsible?->document;
        \Log::info('Escola NIF:', ['nif' => $nif]);  // Log NIF for Escola
    }
    // Empresa
    else if ($role == 14) {
        $nif = $user->company?->responsible?->document;
        \Log::info('Empresa NIF:', ['nif' => $nif]);  // Log NIF for Empresa
    }
    // Candidato
    else if ($role == 13) {
        $nif = $user->candidate?->cpf;
        \Log::info('Candidato CPF:', ['cpf' => $nif]);  // Log CPF for Candidato
    }
    // Admin
    else {
        $nif = "[NIF não configurado]";
    }

    \Log::info('Final NIF:', ['nif' => $nif]);  // Log the final NIF value

    return response()->json(['nif' => $nif]);
}
}
