<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Http\Requests\BaseRercords\StoreBaseRecordRequest;
use App\Http\Requests\BaseRercords\UpdateBaseRecordRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\BaseRecordResource;
use App\Models\Shared\BaseRecord;
use App\Services\BaseRecordService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use function response;

class BaseRecordsController extends Controller
{
    public function __construct(public BaseRecordService $baseRecordService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(FilterRequest $request)
    {
        return BaseRecordResource::collection($this->baseRecordService->index($request->all()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\BaseRercords\StoreBaseRecordRequest $request
     * @return BaseRecordResource
     */
    public function store(StoreBaseRecordRequest $request)
    {
        return new BaseRecordResource(BaseRecord::create($request->all()));
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Shared\BaseRecord $baseRecord
     * @return BaseRecordResource
     */
    public function show(BaseRecord $baseRecord)
    {
        return new BaseRecordResource($baseRecord);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\BaseRercords\UpdateBaseRecordRequest $request
     * @param \App\Models\Shared\BaseRecord $baseRecord
     * @return BaseRecordResource
     */
    public function update(UpdateBaseRecordRequest $request, BaseRecord $baseRecord)
    {
        $baseRecord->update($request->all());
        return new BaseRecordResource($baseRecord);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Shared\BaseRecord $baseRecord
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(BaseRecord $baseRecord)
    {
        return response()->json(['deleted' => $baseRecord->delete()]);
    }
}
