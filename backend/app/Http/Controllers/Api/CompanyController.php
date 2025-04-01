<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\Companies\CompanyResource;
use App\Models\Company\Company;
use App\Services\CompaniesService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CompanyController extends Controller
{
    public function __construct(public CompaniesService $companiesService)
    {
    }

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
}
