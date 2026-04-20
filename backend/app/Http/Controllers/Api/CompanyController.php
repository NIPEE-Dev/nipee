<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyBranchUserRequest;
use App\Http\Requests\Company\StoreCompanySectorUserRequest;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyBranchUserRequest;
use App\Http\Requests\Company\UpdateCompanySectorUserRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\Companies\CompanyResource;
use App\Http\Resources\CompanyBranchResource;
use App\Http\Resources\CompanySectorResource;
use App\Models\Company\Company;
use App\Models\Company\CompanyBranch;
use App\Models\Company\CompanySector;
use App\Services\CompaniesService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function __construct(public CompaniesService $companiesService) {}

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = auth()->user();
        $userId = $user->id;

        if ($user->role_id == 14) {
            $criteria = array_merge($request->all(), ['user_id' => $userId]);
        } else {
            $criteria = $request->all();
        }

        return CompanyResource::collection($this->companiesService->index($criteria));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCompanyRequest $request
     * @return CompanyResource
     */
    public function store(StoreCompanyRequest $request): CompanyResource
    {
        return new CompanyResource($this->companiesService->store($request->all())->load(['billing', 'responsible', 'contact', 'address', 'documents']));
    }

    /**
     * Display the specified resource.
     *
     * @param Company $company
     * @return CompanyResource
     */
    public function show(Company $company): CompanyResource
    {
        return new CompanyResource($company->load(['billing', 'responsible', 'contact', 'address', 'documents']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCompanyRequest $request
     * @param Company $company
     * @return CompanyResource
     */
    public function update(UpdateCompanyRequest $request, Company $company): CompanyResource
    {
        $this->companiesService->update($company, $request->all());
        return new CompanyResource($company->load(['billing', 'responsible', 'contact', 'address', 'documents']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Company $company
     * @return CompanyResource
     */
    public function destroy(Company $company): CompanyResource
    {
        $company->trashed() ? $company->restore() : $company->delete();
        return new CompanyResource($company);
    }

    public function indexCompanyBranchUser(Request $request)
    {
        $user = Auth::user();
        return CompanyBranchResource::collection($this->companiesService->indexCompanyBranchUser($user));
    }

    public function storeCompanyBranchUser(StoreCompanyBranchUserRequest $request): CompanyBranchResource
    {
        $user = Auth::user();
        return new CompanyBranchResource($this->companiesService->storeCompanyBranchUser($user, $request->validated()));
    }

    public function updateCompanyBranchUser(UpdateCompanyBranchUserRequest $request, CompanyBranch $companyBranch): CompanyBranchResource
    {
        $user = Auth::user();
        return new CompanyBranchResource($this->companiesService->updateCompanyBranchUser($user, $companyBranch, $request->validated()));
    }

    public function destroyCompanyBranchUser(CompanyBranch $companyBranch): Response
    {
        $user = Auth::user();
        $this->companiesService->destroyCompanyBranchUser($user, $companyBranch);

        return response()->noContent();
    }

    public function storeCompanySectorUser(StoreCompanySectorUserRequest $request, CompanyBranch $companyBranch): CompanySectorResource
    {
        $user = Auth::user();
        return new CompanySectorResource($this->companiesService->storeCompanySectorUser($user, [...$request->validated(), 'branch_id' => $companyBranch->id]));
    }

    public function updateCompanySectorUser(UpdateCompanySectorUserRequest $request, CompanyBranch $companyBranch, CompanySector $companySector): CompanySectorResource
    {
        $user = Auth::user();
        return new CompanySectorResource($this->companiesService->updateCompanySectorUser($user, $companySector, $request->validated()));
    }

    public function destroyCompanySectorUser(CompanyBranch $companyBranch, CompanySector $companySector): Response
    {
        $user = Auth::user();
        $this->companiesService->destroyCompanySectorUser($user, $companySector);

        return response()->noContent();
    }
}
