<?php

namespace App\Http\Controllers;

use App\Enums\RolesEnum;
use App\Http\Requests\CreateFctEvaluationRequest;
use App\Http\Requests\UploadFctEvaluationRequest;
use App\Http\Resources\FctEvaluationResource;
use App\Services\FctEvaluationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FctEvaluationController extends Controller
{
    private FctEvaluationService $fctEvaluationService;

    public function __construct(FctEvaluationService $fctEvaluationService = new FctEvaluationService)
    {
        $this->fctEvaluationService = $fctEvaluationService;
    }

    public function index()
    {
        $user = Auth::user();
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $evaluations = [];
        if ($roleId === RolesEnum::CANDIDATE->value) {
            $candidateId = $user->candidate->id;
            $evaluations = $this->fctEvaluationService->getByCandidateId($candidateId);
        }

        if ($roleId === RolesEnum::SCHOOL->value) {
            $schoolId = $user->school->first()->id;
            $evaluations = $this->fctEvaluationService->getBySchoolId($schoolId);
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $companyId = $user->company->id;
            $evaluations = $this->fctEvaluationService->getByCompanyId($companyId);
        }

        return response()->json(['data' => FctEvaluationResource::collection($evaluations)]);
    }

    public function store(CreateFctEvaluationRequest $request, $id)
    {
        $data = $request->validated();

        $this->fctEvaluationService->create([...$data, "id" => $id]);

        return response()->noContent();
    }

    public function upload(UploadFctEvaluationRequest $request, $id)
    {
        $data = $request->validated();

        $this->fctEvaluationService->upload($id, $request->file('file'));

        return response()->noContent();
    }
}
