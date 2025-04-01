<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use App\Services\SchoolService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SchoolController extends Controller
{
    public function __construct(public SchoolService $schoolService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return SchoolResource::collection($this->schoolService->index($request->all()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreSchoolRequest $request
     * @return SchoolResource
     */
    public function store(StoreSchoolRequest $request)
    {
        return new SchoolResource($this->schoolService->store($request->all()));
    }

    /**
     * Display the specified resource.
     *
     * @param School $school
     * @return SchoolResource
     */
    public function show($school)
    {
        $school = School::withTrashed()->whereKey($school)->first();
        return new SchoolResource($school->load(['contact', 'address', 'responsible', 'documents']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateSchoolRequest $request
     * @param School $school
     * @return SchoolResource
     */
    public function update(UpdateSchoolRequest $request, School $school)
    {
        $this->schoolService->update($school, $request->all());
        return new SchoolResource($school->load(['contact', 'address', 'responsible', 'documents']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param School $school
     * @return SchoolResource
     */
    public function destroy(School $school)
    {
        $school->trashed() ? $school->restore() : $school->delete();
        return new SchoolResource($school->load(['contact', 'address', 'responsible', 'documents']));
    }
}
