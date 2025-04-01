<?php

namespace App\Http\Middleware;

use App\Models\Users\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AuthGate
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        Auth::shouldUse('api');

        if (Auth::check()) {
            Gate::before(function ($user) {
                return $user->isSysAdmin();
            });

            $allowedSlugs = user()->permissions();
            foreach ($allowedSlugs as $slug) {
                Gate::define($slug, function (User $user) {
                    return true;
                });
            }
        }

        return $next($request);
    }
}
