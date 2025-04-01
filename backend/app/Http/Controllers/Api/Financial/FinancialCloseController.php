<?php

namespace App\Http\Controllers\Api\Financial;

use App\Enums\Financial\StatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\FilterRequest;
use App\Http\Requests\Financial\CreateFinancialCloseRequest;
use App\Http\Resources\Financial\FinancialCloseListResource;
use App\Http\Resources\Financial\FinancialCloseResource;
use App\Models\Financial\FinancialClose;
use App\Models\Financial\FinancialCloseCompany;
use App\Models\Financial\FinancialCloseItems;
use App\Services\Financial\FinancialCloseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FinancialCloseController extends Controller
{
    public function __construct(public FinancialCloseService $financialCloseService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param FilterRequest $request
     * @return AnonymousResourceCollection
     */
    public function index(FilterRequest $request): AnonymousResourceCollection
    {
        return FinancialCloseListResource::collection($this->financialCloseService->index($request->validated()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateFinancialCloseRequest $request
     * @return FinancialCloseResource
     */
    public function store(CreateFinancialCloseRequest $request): FinancialCloseResource
    {
        return new FinancialCloseResource($this->financialCloseService->load($this->financialCloseService->store($request->validated())));
    }

    /**
     * Display the specified resource.
     *
     * @param FinancialClose $financialClose
     * @return FinancialCloseResource
     */
    public function show(FinancialClose $financialClose): FinancialCloseResource
    {
        return new FinancialCloseResource($this->financialCloseService->load($financialClose));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param FinancialClose $financialClose
     * @return FinancialCloseResource
     */
    public function update(FinancialClose $financialClose): FinancialCloseResource
    {
        $financialClose->update(['status' => StatusEnum::BILLED]);
        $this->financialCloseService->generatePayment($financialClose);
        return new FinancialCloseResource($this->financialCloseService->load($financialClose));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param FinancialClose $financialClose
     * @return JsonResponse
     */
    public function destroy(FinancialClose $financialClose): JsonResponse
    {
        return new JsonResponse(['deleted' => $financialClose->delete()]);
    }

    public function updateRowValue(Request $request, FinancialCloseItems $financialCloseItem): JsonResponse
    {
        $value = maskToFloat($request->post('value'));
        $financialClose = $financialCloseItem->financialCompany->financialClose;
        return new JsonResponse([
            'data' => $this->financialCloseService->updateRowValue($financialCloseItem, $value),
            'group_total' => (float)$financialCloseItem->financialCompany->totalValue(),
            'commission' => $financialClose->buildCommission(),
            'total' => (float)$financialCloseItem->financialCompany->financialClose->totalFinancialCloseValue()
        ]);
    }

    public function discriminatingDownload(Request $request, FinancialCloseCompany $financialCloseCompany): ?string
    {
        return $this->financialCloseService->discriminatingDownload($financialCloseCompany);
    }

    public function destroyCompanyRowItem(FinancialCloseItems $financialCloseItem): JsonResponse
    {
        $deleted = $financialCloseItem->delete();
        $financialCompany = $financialCloseItem->financialCompany;
        $financialClose = $financialCompany->financialClose;

        $companyShouldByDeleted = $financialCompany->items()->count() === 0;
        if ($companyShouldByDeleted) {
            $financialCompany->delete();
        }

        return new JsonResponse([
            'deleted' => $deleted,
            'data' => $financialCloseItem,
            'group_total' => (float)$financialCompany->totalValue(),
            'commission' => $financialClose->buildCommission(),
            'total' => (float)$financialClose->totalFinancialCloseValue(),
            'companyDelete' => $companyShouldByDeleted
        ]);
    }
}
