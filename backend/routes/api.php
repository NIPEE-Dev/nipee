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
use App\Http\Controllers\FctEvaluationController;
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
Route::get('companies/branches', [CompanyController::class, 'indexCompanyBranchUser'])->middleware('checkPermission:companies.index');
Route::post('companies/branches', [CompanyController::class, 'storeCompanyBranchUser'])->middleware('checkPermission:companies.index');
Route::put('companies/branches/{companyBranch}', [CompanyController::class, 'updateCompanyBranchUser'])->middleware('checkPermission:companies.index');
Route::delete('companies/branches/{companyBranch}', [CompanyController::class, 'destroyCompanyBranchUser'])->middleware('checkPermission:companies.index');
Route::post('companies/branches/{companyBranch}/sectors', [CompanyController::class, 'storeCompanySectorUser'])->middleware('checkPermission:companies.index');
Route::put('companies/branches/{companyBranch}/sectors/{companySector}', [CompanyController::class, 'updateCompanySectorUser'])->middleware('checkPermission:companies.index');
Route::delete('companies/branches/{companyBranch}/sectors/{companySector}', [CompanyController::class, 'destroyCompanySectorUser'])->middleware('checkPermission:companies.index');
Route::apiResource('companies', CompanyController::class)->middleware('checkPermission:companies.index')->withTrashed(['destroy']);

Route::controller(SchoolController::class)->prefix('schools')->group(function () {
    Route::get('/', 'index')->withoutMiddleware('auth:api');
    Route::get('/public', 'publicSchools')->withoutMiddleware('auth:api');
    Route::post('/', 'store')->middleware('checkPermission:schools.index');
    Route::get('/{school}', 'show')->middleware('checkPermission:schools.index');
    Route::get('/{school}/courses', 'getCourses')->withoutMiddleware('auth:api');
    Route::put('/{school}', 'update')->middleware('checkPermission:schools.index');
    Route::delete('/{school}', 'destroy')->withTrashed()->middleware('checkPermission:schools.index');
});

Route::get('candidates/feedback', [CandidateController::class, 'indexFeedbacks'])->middleware('checkPermission:candidates.index');
Route::post('candidates/{candidate}/feedback', [CandidateController::class, 'storeFeedback'])->middleware('checkPermission:candidates.index');
Route::get('candidates/{candidate}/history', [CandidateController::class, 'history'])->middleware('checkPermission:candidates.index');
Route::get('candidates/{candidate}/history/download', [CandidateController::class, 'exportHistory'])->withoutMiddleware(['auth:api']);
Route::get('candidates/interviewing', [CandidateController::class, 'schoolCandidates'])->middleware('checkPermission:candidates.index');
Route::apiResource('candidates', CandidateController::class)->middleware('checkPermission:candidates.index');
Route::post('candidates/{candidate}/document', [CandidateController::class, 'storeDocuments'])->middleware('checkPermission:candidates.index');
Route::prefix('base-records')->group(function () {
    Route::get('/', [BaseRecordsController::class, 'index'])->withoutMiddleware('auth:api');
    Route::post('/', [BaseRecordsController::class, 'store'])->middleware('checkPermission:base-records.index');
    Route::get('/{baseRecord}', [BaseRecordsController::class, 'show'])->middleware('checkPermission:base-records.index');
    Route::put('/{baseRecord}', [BaseRecordsController::class, 'update'])->middleware('checkPermission:base-records.index');
    Route::delete('/{baseRecord}', [BaseRecordsController::class, 'destroy'])->middleware('checkPermission:base-records.index');
});

Route::get('jobs/public', [JobController::class, 'publicJobs'])->withoutMiddleware(['checkPermission:jobs.index', 'auth:api']);
Route::get('jobs/history', [JobController::class, 'jobsHistory'])->middleware('checkPermission:jobs.index');
Route::get('jobs/invites/interview', [JobController::class, 'interviewInvites'])->middleware('checkPermission:jobs.index');
Route::put('jobs/invites/interview/{jobInterview}', [JobController::class, 'updateJobInterview'])->middleware('checkPermission:jobs.index');
Route::post('jobs/candidates/call', [JobController::class, 'callCandidates'])->middleware('checkPermission:jobs.index');
Route::put('jobs/candidates/update-status', [JobController::class, 'updateStatus'])->middleware('checkPermission:jobs.index');
Route::apiResource('jobs', JobController::class)->middleware('checkPermission:jobs.index')->withTrashed(['destroy']);
Route::post('jobs/{job}/apply', [JobController::class, 'apply'])->middleware('checkPermission:jobs.index');
Route::post('jobs/{job}/invite', [JobController::class, 'inviteToJob'])->middleware('checkPermission:jobs.index');
Route::post('jobs/{job}/invite/interview', [JobController::class, 'storeInvite'])->middleware('checkPermission:jobs.index');
Route::delete('jobs/{job}/invite/interview/{candidateId}/cancel', [JobController::class, 'cancelJobInterview'])->middleware('checkPermission:jobs.index');
Route::put('jobs/{job}/invite/interview/{candidateId}/evaluation', [JobController::class, 'updateJobInterviewEvaluation'])->middleware('checkPermission:jobs.index');
Route::put('jobs/{job}/invite/interview/{candidateId}/testing', [JobController::class, 'updateJobTestingEvaluation'])->middleware('checkPermission:jobs.index');
Route::patch('jobs/{job}/status', [JobController::class, 'updateJobStatus'])->middleware('checkPermission:jobs.index');

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
Route::post('/contracts/{contractId}/upload-signature-school', [SignatureController::class, 'uploadSignatureSchool'])->middleware('checkPermission:documents.index');

Route::post('/documents/{document}/signed-contract', [DocumentsController::class, 'updateSignedContract'])->middleware('checkPermission:documents.index');
Route::post('/documents/{document}/restart', [DocumentsController::class, 'restartSignedContract'])->middleware('checkPermission:documents.index');

Route::get('/fct-evaluations', [FctEvaluationController::class, 'index']);
Route::post('/fct-evaluations/{id}', [FctEvaluationController::class, 'store']);
Route::post('/fct-evaluations/{id}/upload', [FctEvaluationController::class, 'upload']);
Route::get('/storage/generated_documents/guarulhos/{file}', [DocumentsController::class, 'downloadFile']);
