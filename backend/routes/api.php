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
use App\Http\Middleware\CheckPermission;

/*
|--------------------------------------------------------------------------
// API Routes
|--------------------------------------------------------------------------
// Here is where you can register API routes for your application. These
// routes are loaded by the RouteServiceProvider within a group which
// is assigned the "api" middleware group. Enjoy building your API!
*/

require __DIR__ . '/activities/activities.php';

Route::get('ping', function () {
    return response('pong');
});

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    Route::post('logout', fn() => response()->json()->withoutCookie('brilho-auth-token'))->name('logout');
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});
Route::get('/nif', [UserController::class, 'getNif']);
Route::apiResource('documents', DocumentsController::class)->only(['index', 'update', 'destroy'])->middleware('checkPermission:documents.index');
Route::apiResource('users', UserController::class)->middleware('checkPermission:users.index');
Route::apiResource('companies', CompanyController::class)->middleware('checkPermission:companies.index')->withTrashed(['destroy']);

Route::controller(SchoolController::class)->prefix('schools')->group(function () {
    Route::get('/', 'index')->withoutMiddleware('auth:api');
    Route::post('/', 'store')->middleware('checkPermission:schools.index');
    Route::get('/{school}', 'show')->middleware('checkPermission:schools.index');
    Route::get('/{school}/courses', 'getCourses')->withoutMiddleware('auth:api');
    Route::put('/{school}', 'update')->middleware('checkPermission:schools.index');
    Route::delete('/{school}', 'destroy')->withTrashed()->middleware('checkPermission:schools.index');
});

Route::apiResource('candidates', CandidateController::class)->middleware('checkPermission:candidates.index');
Route::prefix('base-records')->group(function () {
    Route::get('/', [BaseRecordsController::class, 'index'])->withoutMiddleware('auth:api');
    Route::post('/', [BaseRecordsController::class, 'store'])->middleware('checkPermission:base-records.index');
    Route::get('/{baseRecord}', [BaseRecordsController::class, 'show'])->middleware('checkPermission:base-records.index');
    Route::put('/{baseRecord}', [BaseRecordsController::class, 'update'])->middleware('checkPermission:base-records.index');
    Route::delete('/{baseRecord}', [BaseRecordsController::class, 'destroy'])->middleware('checkPermission:base-records.index');
});

Route::post('jobs/candidates/call', [JobController::class, 'callCandidates'])->middleware('checkPermission:jobs.index');
Route::put('jobs/candidates/update-status', [JobController::class, 'updateStatus'])->middleware('checkPermission:jobs.index');
Route::apiResource('jobs', JobController::class)->middleware('checkPermission:jobs.index')->withTrashed(['destroy']);

Route::get('contracts/job/{job}/candidate/{candidate}', [ContractController::class, 'loadContractData'])->middleware('checkPermission:contracts.index');
Route::delete('contracts/{contract}', [ContractController::class, 'destroy'])->middleware('checkPermission:contracts.end')->withTrashed();

Route::get('documents/{file}/download', [ContractController::class, 'download'])->middleware('checkPermission:documents.index');
Route::get('reports/system-activity', [ReportController::class, 'systemActivityReport'])->middleware('checkPermission:financial-close.index');
Route::get('reports/candidates', [ReportController::class, 'candidatesReport'])->middleware('checkPermission:financial-close.index');
Route::apiResource('contracts', ContractController::class)->middleware('checkPermission:contracts.index');

Route::put('financial-company/{financialCloseItem}', [FinancialCloseController::class, 'updateRowValue'])->middleware('checkPermission:financial-close.index');
Route::delete('financial-company/delete/{financialCloseItem}', [FinancialCloseController::class, 'destroyCompanyRowItem'])->middleware('checkPermission:financial-close.index');
Route::get('financial-company/{financialCloseCompany}/discriminating/download', [FinancialCloseController::class, 'discriminatingDownload'])->middleware('checkPermission:financial-close.index');
Route::apiResource('financial-close', FinancialCloseController::class)->middleware('checkPermission:financial-close.index');

Route::apiResource('insurance-settings', SettingsController::class)
    ->parameter('insurance-settings', 'settings')
    ->only(['index', 'show', 'update'])->middleware('checkPermission:insurance-settings.index');

Route::post('files/upload', FileUploadController::class)->middleware('checkPermission:documents.index');
Route::get('download/{resource}', TableDownloadController::class)->middleware('checkPermission:documents.index');

Route::get('sellers', static function () {
    return UserResource::collection(User::query()->whereHas('roles', function (Builder $builder) {
        $builder->where('title', 'LIKE', '%Vendedor%');
    })->get());
})->withoutMiddleware('auth:api');

Route::resource('roles', RolesController::class)->middleware('checkPermission:roles.index');

Route::apiResource('company-pre-registrations', CompanyPreRegistrationController::class)->middleware('checkPermission:companies.index');
Route::post('company-pre-registrations/{id}/approve', [CompanyPreRegistrationController::class, 'approve'])->middleware('checkPermission:companies.index');
Route::post('company-pre-registrations/{id}/reject', [CompanyPreRegistrationController::class, 'reject'])->middleware('checkPermission:companies.index');

Route::apiResource('students-pre-registrations', StudentsPreRegistrationController::class)->middleware('checkPermission:schools.index');
Route::post('students-pre-registrations/{id}/approve', [StudentsPreRegistrationController::class, 'approve'])->middleware('checkPermission:schools.index');
Route::post('students-pre-registrations/{id}/reject', [StudentsPreRegistrationController::class, 'reject'])->middleware('checkPermission:schools.index');

//! rotas para criação da assinatura
Route::post('/contracts/{contractId}/upload-signature-company', [SignatureController::class, 'uploadSignatureCompany'])->name('contracts.upload-signature-company')->middleware('checkPermission:contracts.reactive');
Route::post('/contracts/{contractId}/upload-signature-school', [SignatureController::class, 'uploadSignatureSchool'])->middleware('checkPermission:contracts.reactive');
