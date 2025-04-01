<?php

namespace App\Http\Controllers\Api\Insurance;

use App\Http\Controllers\Controller;
use App\Http\Requests\FilterRequest;
use App\Http\Requests\Insurance\SettingsRequest;
use App\Http\Resources\Insurance\SettingsResource;
use App\Models\Insurance\Settings;
use App\Services\Insurance\SettingsService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SettingsController extends Controller
{
    public function __construct(private SettingsService $insuranceSettingsService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param FilterRequest $filterRequest
     * @return AnonymousResourceCollection
     */
    public function index(FilterRequest $filterRequest): AnonymousResourceCollection
    {
        return SettingsResource::collection($this->insuranceSettingsService->index($filterRequest->validated()));
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Insurance\Settings $settings
     * @return SettingsResource
     */
    public function show(Settings $settings): SettingsResource
    {
        return new SettingsResource($settings);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SettingsRequest $request
     * @param \App\Models\Insurance\Settings $settings
     * @return SettingsResource
     */
    public function update(SettingsRequest $request, Settings $settings): SettingsResource
    {
        $settings->update($request->validated());
        return new SettingsResource($settings);
    }
}
