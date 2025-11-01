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
use App\Mail\SendResetCodeMail;
use App\Models\StudentsPreRegistration;
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
        $preRegistration = StudentsPreRegistration::query()->where('email', $credentials['email'])->first();
        if (isset($preRegistration) && $preRegistration->status === 'Rejeitado') {
            return response()->json(['error' => 'Pré-Registos rejeitado'], 401);
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
        $response = [
            'permissions' => $user?->roles?->first()?->permissions->pluck('slug') ?? [],
            'username' => $user?->name,
            'user_id' => $user?->id,
            'role' => $user?->roles?->first()?->title ?? '',
            'candidate_id' => $user?->candidate?->toArray()['id']
        ];
        if (is_null($response['candidate_id'])) {
            unset($response['candidate_id']);
        }
        return response()->json($response)->withCookie(cookie('brilho-auth-token', $token, 9999999999999999));
    }

    public function requestPasswordCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        $code = rand(100000, 999999);

        $user->password_reset_code = $code;
        $user->password_reset_expires_at = now()->addMinutes(10);
        $user->save();

        Mail::to($user->email)->send(new SendResetCodeMail($user->name, $code));

        return response()->json(['message' => 'Código enviado para seu e-mail.'], 200);
    }


    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|digits:6',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        if (
            $user->password_reset_code != $validated['code'] ||
            now()->greaterThan($user->password_reset_expires_at)
        ) {
            return response()->json(['message' => 'Código inválido ou expirado.'], 403);
        }

        $user->password = Hash::make($validated['password']);
        $user->password_reset_code = null;
        $user->password_reset_expires_at = null;
        $user->save();

        Mail::to($user->email)->send(new PasswordChangeSuccess($user->name));

        return response()->json(['message' => 'Senha alterada com sucesso.'], 200);
    }
}
