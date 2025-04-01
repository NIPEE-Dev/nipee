<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CandidateReportResource;
use App\Services\ReportsService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReportController extends Controller
{
    public function __construct(public ReportsService $reportService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function candidatesReport(Request $request)
    {
        return CandidateReportResource::collection($this->reportService->generateCandidatesReport());
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function systemActivityReport(Request $request)
    {
        return ['data' => [$this->reportService->generateSystemActivityReport()]];
    }
}
