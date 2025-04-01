<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\PasswordChangeSuccess;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$this->loginTimeAllowed()) {
            auth()->logout();
            return response()->json(['error' => 'Horário de acesso não permitido'], 401);
        }

        return $this->respondWithToken($token);
    }

    private function loginTimeAllowed(): bool
    {
        /**
         * @var User $user
         */
        $user = auth()->user();
        return strtotime($user->start_hour) <= strtotime(now()->format("H:i:s")) &&
            strtotime($user->end_hour) >= strtotime(now()->format("H:i:s"));
    }

    /**
     * Get the authenticated User.
     *
     * @return JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Refresh a token.
     *
     * @return JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     * @return JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = auth()->user()->load('roles.permissions');
        return response()->json([
            'permissions' => $user?->roles?->first()?->permissions->pluck('slug') ?? [],
            'username' => $user?->name,
            'user_id' => $user?->id,
            'role' => $user?->roles?->first()?->title ?? ''
        ])->withCookie(cookie('brilho-auth-token', $token, 9999999999999999));
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|min:3|confirmed',
            'password_confirmation' => 'required|min:6',
        ]);

        $email = $request->input('email');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['message' => 'E-mail inválido.'], 422);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        //Mail::to($user->email)->send(new PasswordChangeSuccess($user->name));

        return response()->json(['message' => 'Senha alterada com sucesso.'], 200);
    }
}
