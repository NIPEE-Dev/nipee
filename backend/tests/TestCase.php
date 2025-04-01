<?php

namespace Tests;

use App\Models\Users\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshTestDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->signIn();
    }

    protected function signIn($user = null)
    {
        $user = $user ?? create(User::class);

        $iat = time();
        $jti = md5($user->id . $iat);

        $payload = JWTFactory::sub($user->id)
            ->iss('api')
            ->iat($iat)
            ->exp(time() + 2 * 7 * 24 * 60 * 60)
            ->nbf($iat)
            ->jti($jti)
            ->make();

        $token = JWTAuth::encode($payload);
        $this->disableCookieEncryption()->withCookie('brilho-auth-token', $token)->withCredentials();

        $this->actingAs($user, 'api');
        return $this;
    }

    protected function setBaseRoute($route)
    {
        $this->base_route = $route;
    }

    protected function setBaseModel($model)
    {
        $this->base_model = $model;
    }

    protected function list($route = '')
    {
        $this->withoutExceptionHandling();

        $route = $this->base_route ? "{$this->base_route}.index" : $route;

        $response = $this->getJson(route($route));

        $response->assertSuccessful();
        return $response;
    }

    protected function create($attributes = [], $model = '', $route = '')
    {
        $this->withoutExceptionHandling();

        $route = $this->base_route ? "{$this->base_route}.store" : $route;
        $model = $this->base_model ?? $model;

        $attributes = raw($model, $attributes);

        $response = $this->postJson(route($route), $attributes);

        $response->assertSuccessful();

        $model = new $model;

        $this->assertDatabaseHas($model->getTable(), $attributes);

        return $response;
    }

    protected function update($attributes = [], $model = '', $route = '')
    {
        $this->withoutExceptionHandling();

        $route = $this->base_route ? "{$this->base_route}.update" : $route;
        $model = $this->base_model ?? $model;

        $model = create($model);

        $response = $this->putJson(route($route, $model->id), $attributes);

        $response->assertSuccessful();

        tap($model->fresh(), function ($model) use ($attributes) {
            collect($attributes)->each(function ($value, $key) use ($model) {
                $this->assertEquals($value, $model[$key]);
            });
        });

        return $response;
    }

    protected function destroy($model = '', $route = '')
    {
        $this->withoutExceptionHandling();

        $route = $this->base_route ? "{$this->base_route}.destroy" : $route;
        $model = $this->base_model ?? $model;

        $model = create($model);

        $response = $this->deleteJson(route($route, $model->id));

        $this->assertDatabaseMissing($model->getTable(), $model->toArray());

        return $response;
    }

    public function multipleDelete($model = '', $route = '')
    {
        $this->withoutExceptionHandling();

        $route = $this->base_route ? "{$this->base_route}.destroyAll" : $route;
        $model = $this->base_model ?? $model;

        $model = create($model, [], 5);

        $ids = $model->map(function ($item, $key) {
            return $item->id;
        });

        return $this->deleteJson(route($route), ['ids' => $ids]);
    }

    protected function setUpTraits(): array
    {
        $uses = parent::setUpTraits();

        if (isset($uses[RefreshTestDatabase::class])) {
            $this->refreshTestDatabase();
        }

        return $uses;
    }
}
