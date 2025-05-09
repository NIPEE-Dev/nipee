<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use App\Models\Users\User;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param string $permission
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $permissions = $user?->roles?->first()?->permissions->pluck('slug')->toArray();
        if (!in_array($permission, $permissions)) {
            abort(403, 'Forbidden');
        }

        return $next($request);
    }
}
