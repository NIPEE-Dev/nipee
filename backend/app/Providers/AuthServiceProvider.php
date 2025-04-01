<?php

namespace App\Providers;

use App\Policies\TeamPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Tymon\JWTAuth\Http\Parser\Cookies;
use Tymon\JWTAuth\Http\Parser\RouteParams;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [

    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        $cookies = new Cookies(config('jwt.decrypt_cookies'));
        $cookies->setKey('brilho-auth-token');

        $this->app['tymon.jwt.parser']->setChain([
            new RouteParams,
            $cookies,
        ]);
    }
}
