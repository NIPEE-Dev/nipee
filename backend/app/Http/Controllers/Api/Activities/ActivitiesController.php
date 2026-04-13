<?php

namespace App\Http\Controllers\Api\Activities;

use App\Enums\ActiveEnum;
use App\Enums\Activities\ActivityStatusEnum;
use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Activities\CreateActivityRequest;
use App\Http\Requests\Activities\UpdateActivityRequest;
use App\Http\Requests\Activities\UpdateActivityStatusRequest;
use App\Http\Resources\Activities\ActivityResource;
use App\Http\Resources\FctReportResource;
use App\Services\Activities\ActivitiesService;
use App\Traits\Common\TransformArrayKeysToSnakeCase;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ActivitiesController extends Controller
{
    use TransformArrayKeysToSnakeCase;
    private ActivitiesService $activitiesService;

    public function __construct(ActivitiesService $activitiesService = new ActivitiesService)
    {
        $this->activitiesService = $activitiesService;
    }

    public function indexReports()
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $reports = [];

        if ($roleId === RolesEnum::SCHOOL->value) {
            $schoolId = $user->school->first()->id;
            $reports = $this->activitiesService->getReportsBySchoolId($schoolId);
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $companyId = $user->company->id;
            $reports = $this->activitiesService->getReportsByCompanyId($companyId);
        }

        return FctReportResource::collection($reports);
    }

    public function index()
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $activities = [];
        $filters = Validator::make(request()->all(), [
            'startDate' => 'date|date_format:Y-m-d',
            'endDate' => 'date|date_format:Y-m-d',
        ])->validate();

        if ($roleId === RolesEnum::CANDIDATE->value) {
            $activities = $this->activitiesService->getByUserId($user->id);
            $activeContract = $user->candidate && $user->candidate->contracts ? $user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first() : null;

            if (!isset($activeContract)) {
                return response()->json([
                    'activeContract' => false,
                ]);
            }

            $workedHours = $activities->where('job_id', $activeContract->originalJob->id)->reduce(function ($carry, $item) {
                return $carry + $item->estimated_time ?? 0;
            }, 0);

            return response()->json([
                'activeContract' => true,
                'contractStart' => $activeContract->start_contract_vigence->format('Y-m-d'),
                'contractEnd' => $activeContract->end_contract_vigence->format('Y-m-d'),
                'activities' => ActivityResource::collection($activities),
                'totalHours' => $activeContract->originalJob?->fct_hours ?? 0,
                'workedHours' => $workedHours,
            ]);
        }

        if ($roleId === RolesEnum::SCHOOL->value) {
            $activities = $this->activitiesService->getBySchoolId($user->id, $filters);

            return ActivityResource::collection($activities);
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $companyId = $user->company->id;
            $activities = $this->activitiesService->getByCompanyId($companyId, $filters);

            return ActivityResource::collection($activities);
        }

        return ActivityResource::collection($activities);
    }

    public function store(CreateActivityRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $jobId = $user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first()->originalJob->id ?? null;

        $activity = $this->activitiesService->create([
            ...$this->transformArrayKeysToSnakeCase($data),
            'job_id' => $jobId,
            'user_id' => $user->id,
            'status' => isset($data['draft']) && $data['draft'] === 1 ? ActivityStatusEnum::PENDING->value : ActivityStatusEnum::DRAFT->value,
        ]);

        return new ActivityResource($activity);
    }

    public function show($id)
    {
        //
    }

    public function update(UpdateActivityRequest $request, $id)
    {
        $data = $request->validated();
        $activity = $this->activitiesService->update([
            ...$this->transformArrayKeysToSnakeCase($data),
            'status' => isset($data['draft']) && $data['draft'] === 1 ? ActivityStatusEnum::PENDING->value : ActivityStatusEnum::DRAFT->value,
        ], $id);

        return new ActivityResource($activity);
    }

    public function updateStatus(UpdateActivityStatusRequest $request, $id)
    {
        $data = $request->validated();
        $status = $data['approved'] === true ? ActivityStatusEnum::APPROVED->value : ActivityStatusEnum::REPROVED->value;
        $activity = $this->activitiesService->update([
            ...$data,
            'status' => $status,
            'justificated_at' => Carbon::now(),
        ], $id);

        return new ActivityResource($activity);
    }

    public function destroy($id)
    {
        $activity = $this->activitiesService->getById($id);
        if (!isset($activity)) {
            return response()->json(['message' => 'Atividade não encontrada'], 400);
        }
        $activity->delete();

        return response()->json(['message' => 'Atividade deletada']);
    }
}
