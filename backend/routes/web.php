<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyPreRegistrationController;
use App\Http\Controllers\StudentsPreRegistrationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ContatoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('asaas', function () {
    $gateway = \App\API\Payment\Gateways\GatewayFactory::make(\App\Enums\Payment\GatewayEnum::ASAAS);
    dd($gateway->clients());
});*/

Route::permanentRedirect('login', config('app.url'))->name('login');
Route::post('company-pre-registrations/store', [CompanyPreRegistrationController::class, 'store']);

Route::post('students-pre-registrations/store', [StudentsPreRegistrationController::class, 'store']);

Route::post('change-password', [AuthController::class, 'changePassword']);
Route::post('send-verification-code', [AuthController::class, 'requestPasswordCode']);

Route::post('enviar-contato', [ContatoController::class, 'enviarFormulario']);

