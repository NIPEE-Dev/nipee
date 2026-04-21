<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActiveEnum;
use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCandidateFeedbackRequest;
use App\Http\Requests\StoreCandidateDocumentsRequest;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Http\Resources\CandidateFeedbackResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CandidateResource;
use App\Models\Candidate;
use App\Services\CandidatesService;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CandidateController extends Controller
{
    public function __construct(public CandidatesService $candidatesService) {}

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
        //ddApi(Candidate::query()->get());
        return new CandidateResource($candidate->load([
            'contact',
            'address',
            'documents',
            'user',
            'user.school',
            'jobs' => [
                'history' => fn(HasMany $builder) => $builder->where('candidate_id', '=', $candidate->id),
                'company',
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

    public function schoolCandidates(Request $request)
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;

        if ($roleId !== RolesEnum::SCHOOL->value) throw new HttpException(400, 'Deve ser uma escola para usar esse recurso');

        $schoolId = $user->school->first()->id;
        $candidates = $this->candidatesService->getCandidateInInterview($schoolId);

        return CandidateResource::collection($candidates);
    }

    public function storeDocuments(StoreCandidateDocumentsRequest $request, Candidate $candidate)
    {
        $data = $request->validated();

        $file = $data['file'];
        $type = $data['type'];
        $name = (string) Str::uuid();

        Storage::disk('local')->put('/generated_documents/guarulhos/' . $name . '.' . $file->getClientOriginalExtension(), file_get_contents($file));
        $fileData = [
            'filename' => $name,
            'original_filename' => $type,
            'file_extension' => $file->getClientOriginalExtension(),
            'filesize' => $file->getSize(),
            'type' => $type,
        ];

        $document = $candidate->documents()->create($fileData);
        return response()->json($document, 201);
    }

    public function history(Request $request, Candidate $candidate)
    {
        $data = $this->candidatesService->getCandidateHistory($candidate);
        return response()->json(['data' => $data], 200);
    }

    public function exportHistory(Request $request, Candidate $candidate)
    {
        $data = Validator::make($request->all(), [
            'format' => ['required', 'string', Rule::in(['excel', 'pdf'])],
        ])->validate();
        $file = $this->candidatesService->exportHistory($candidate, $data['format']);
        return response()->download($file);
    }

    public function storeFeedback(CreateCandidateFeedbackRequest $request, Candidate $candidate)
    {
        $data = $request->validated();

        $candidate->feedback()->updateOrCreate(
            [
                'candidate_id' => $candidate->id,
            ],
            [
                'annotation' => $data['annotation']
            ]
        );

        return response()->noContent();
    }

    public function indexFeedbacks(Request $request)
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $candidates = Candidate::query()->whereHas('contracts', function ($q) {
            $q->where('status', '=', ActiveEnum::ACTIVE->value);
        });

        if ($roleId === RolesEnum::SCHOOL->value) {
            $schoolId = $user->school->first()->id;
            $candidates->whereHas('contracts', function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId);
            });
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $companyId = $user->company->id;
            $candidates->whereHas('contracts', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }

        if ($roleId === RolesEnum::COMPANY_BRANCH->value) {
            $sectorsIds = $user->companyBranch->sectors->pluck('id');
            $candidates->whereHas('contracts', function ($q) use ($sectorsIds) {
                $q->whereIn('sector_id', $sectorsIds);
            });
        }

        if ($roleId === RolesEnum::COMPANY_SECTOR->value) {
            $sectorId = $user->company->id;
            $candidates->whereHas('contracts', function ($q) use ($sectorId) {
                $q->where('sector_id', $sectorId);
            });
        }

        return CandidateFeedbackResource::collection($candidates->get());
    }
}
