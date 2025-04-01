<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Http\Resources\CandidateResource;
use App\Models\Candidate;
use App\Services\CandidatesService;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CandidateController extends Controller
{
    public function __construct(public CandidatesService $candidatesService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return CandidateResource::collection($this->candidatesService->index($request->all()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCandidateRequest $request
     * @return CandidateResource
     */
    public function store(StoreCandidateRequest $request)
    {
        return new CandidateResource($this->candidatesService->store($request->all())->load([
            'address',
            'documents',
            'contact'
        ]));
    }

    /**
     * Display the specified resource.
     *
     * @param Candidate $candidate
     * @return CandidateResource
     */
    public function show(Candidate $candidate)
    {
        return new CandidateResource($candidate->load([
            'contact',
            'address',
            'documents',
            'user',
            'user.school',
            'jobs' => [
                'history' => fn (HasMany $builder) => $builder->where('candidate_id', '=', $candidate->id),
                'company',
                'role'
            ]
        ]));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCandidateRequest $request
     * @param Candidate $candidate
     * @return CandidateResource
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        $this->candidatesService->update($candidate, $request->all());
        return new CandidateResource($candidate->load(['address', 'documents', 'contact']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Candidate $candidate
     * @return JsonResponse
     */
    public function destroy(Candidate $candidate)
    {
        return new JsonResponse(['deleted' => $candidate->delete()]);
    }
}
