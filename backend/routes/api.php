<?php

use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\Contracts\ContractController;
use App\Http\Controllers\Api\Financial\FinancialCloseController;
use App\Http\Controllers\Api\Insurance\SettingsController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\Shared\BaseRecordsController;
use App\Http\Controllers\Api\Shared\DocumentsController;
use App\Http\Controllers\Api\Shared\FileUploadController;
use App\Http\Controllers\Api\Shared\TableDownloadController;
use App\Http\Controllers\Api\Users\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Credentials\RolesController;
use App\Http\Controllers\CompanyPreRegistrationController;
use App\Http\Controllers\StudentsPreRegistrationController;
use App\Http\Controllers\SignatureController;
use App\Http\Resources\Users\UserResource;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContatoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('ping', function () {
    return response('pong');
});

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    Route::post('logout', fn () => response()->json()->withoutCookie('brilho-auth-token'))->name('logout');
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::apiResource('documents', DocumentsController::class)->only(['index', 'update', 'destroy']);
Route::apiResource('users', UserController::class);
Route::apiResource('companies', CompanyController::class)->withTrashed(['destroy']);

Route::controller(SchoolController::class)->prefix('schools')->group(function () {
    Route::get('/', 'index')->withoutMiddleware('auth:api');
    Route::post('/', 'store');
    Route::get('/{school}', 'show');
    Route::put('/{school}', 'update');
    Route::delete('/{school}', 'destroy')->withTrashed();
});

// Route::apiResource('schools', SchoolController::class)->withTrashed(['destroy']);
Route::apiResource('candidates', CandidateController::class);
Route::apiResource('base-records', BaseRecordsController::class)->withoutMiddleware('auth:api');

Route::post('jobs/candidates/call', [JobController::class, 'callCandidates']);
Route::put('jobs/candidates/update-status', [JobController::class, 'updateStatus']);
Route::apiResource('jobs', JobController::class)->withTrashed(['destroy']);

Route::get('contracts/job/{job}/candidate/{candidate}', [ContractController::class, 'loadContractData']);
Route::delete('contracts/{contract}', [ContractController::class, 'destroy'])->withTrashed();

Route::get('documents/{file}/download', [ContractController::class, 'download']);
Route::get('reports/system-activity', [ReportController::class, 'systemActivityReport']);
Route::get('reports/candidates', [ReportController::class, 'candidatesReport']);
Route::apiResource('contracts', ContractController::class);

Route::put('financial-company/{financialCloseItem}', [FinancialCloseController::class, 'updateRowValue']);
Route::delete('financial-company/delete/{financialCloseItem}', [FinancialCloseController::class, 'destroyCompanyRowItem']);
Route::get('financial-company/{financialCloseCompany}/discriminating/download', [FinancialCloseController::class, 'discriminatingDownload']);
Route::apiResource('financial-close', FinancialCloseController::class);
Route::apiResource('insurance-settings', SettingsController::class)
    ->parameter('insurance-settings', 'settings')
    ->only([
        'index', 'show', 'update'
    ]);

Route::post('files/upload', FileUploadController::class);
Route::get('download/{resource}', TableDownloadController::class);

Route::get('sellers', static function () {
    return UserResource::collection(User::query()->whereHas('roles', function (Builder $builder) {
        $builder->where('title', 'LIKE', '%Vendedor%');
    })->get());
});

Route::resource('roles', RolesController::class);

Route::apiResource('company-pre-registrations', CompanyPreRegistrationController::class);
Route::post('company-pre-registrations/{id}/approve', [CompanyPreRegistrationController::class, 'approve']);
Route::post('company-pre-registrations/{id}/reject', [CompanyPreRegistrationController::class, 'reject']);

Route::apiResource('students-pre-registrations', StudentsPreRegistrationController::class);
Route::post('students-pre-registrations/{id}/approve', [StudentsPreRegistrationController::class, 'approve']);
Route::post('students-pre-registrations/{id}/reject', [StudentsPreRegistrationController::class, 'reject']);

//! rotas para criação da assinatura
Route::post('/contracts/{contractId}/upload-signature-company', [SignatureController::class, 'uploadSignatureCompany'])->name('contracts.upload-signature-company');
Route::post('/contracts/{contractId}/upload-signature-school', [SignatureController::class, 'uploadSignatureSchool']);
