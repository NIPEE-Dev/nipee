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
use App\Services\Activities\ActivitiesService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivitiesController extends Controller
{
    private ActivitiesService $activitiesService;

    public function __construct(ActivitiesService $activitiesService = new ActivitiesService)
    {
        $this->activitiesService = $activitiesService;
    }

    public function index()
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $activities = [];

        if ($roleId === RolesEnum::CANDIDATE->value) {
            $activities = $this->activitiesService->getByUserId($user->id);
            $activeContract = $user->candidate && $user->candidate->contracts ? $user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first() : null;
            $workedHours = $activities->reduce(function ($carry, $item) {
                return $carry + $item->estimated_time ?? 0;
            }, 0);

            if (!isset($activeContract)) {
                response()->json([
                    'activeContract' => false,
                ]);
            }

            return response()->json([
                'activeContract' => true,
                'activities' => ActivityResource::collection($activities),
                'totalHours' => $user->candidate->hours_fct ?? 0,
                'workedHours' => $workedHours,
            ]);
        }

        if ($roleId === RolesEnum::SCHOOL->value) {
            $activities = $this->activitiesService->getBySchoolId($user->id);

            return ActivityResource::collection($activities);
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $companyId = $user->company->id;
            $activities = $this->activitiesService->getByCompanyId($companyId);

            return ActivityResource::collection($activities);
        }

        return ActivityResource::collection($activities);
    }

    public function store(CreateActivityRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $activity = $this->activitiesService->create([
            ...$data,
            'user_id' => $user->id,
            'estimated_time' => $data['estimatedTime'],
            'activity_date' => $data['activityDate'],
            'status' => $data['draft'] === true ? ActivityStatusEnum::PENDING->value : ActivityStatusEnum::DRAFT->value,
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
            ...$data,
            'estimated_time' => $data['estimatedTime'],
            'status' => $data['draft'] === true ? ActivityStatusEnum::PENDING->value : ActivityStatusEnum::DRAFT->value,
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
