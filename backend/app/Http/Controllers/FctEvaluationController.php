<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFctEvaluationRequest;
use App\Http\Requests\UploadFctEvaluationRequest;
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
        $companyId = $user->company->id;

        $evaluations = $this->fctEvaluationService->getByCompanyId($companyId);

        return $evaluations;
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
