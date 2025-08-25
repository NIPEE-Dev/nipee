<?php

namespace App\Http\Controllers\Api;

use App\Enums\JobStatusEnum;
use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\FilterRequest;
use App\Http\Requests\Jobs\StoreJobsRequest;
use App\Http\Requests\Jobs\UpdateJobsRequest;
use App\Http\Requests\StoreInterviewInviteRequest;
use App\Http\Requests\UpdateJobInterviewRequest;
use App\Http\Requests\UpdateJobStatusRequest;
use App\Http\Resources\InterviewInviteResource;
use App\Http\Resources\JobHistoryResource;
use App\Http\Resources\Jobs\JobResource;
use App\Models\Candidate;
use App\Models\JobInterviewInvite;
use App\Models\Jobs\Job;
use App\Models\Users\User;
use App\Services\Jobs\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    public function __construct(public JobService $jobService) {}

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(FilterRequest $request)
    {
        return JobResource::collection($this->jobService->index($request->all()));
    }

    public function jobsHistory(Request $request)
    {
        $user = Auth::user();

        return JobHistoryResource::collection($this->jobService->getHistory($user->candidate->id ?? null));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreJobsRequest $request
     * @return \App\Http\Resources\Jobs\JobResource
     */
    public function store(StoreJobsRequest $request)
    {
        return new JobResource($this->jobService->store($request->all()));
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Jobs\Job $job
     * @return \App\Http\Resources\Jobs\JobResource
     */
    public function show(Job $job)
    {
        return new JobResource($job->load(['workingDay', 'documents', 'candidates']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Jobs\UpdateJobsRequest $request
     * @param \App\Models\Jobs\Job $job
     * @return \App\Http\Resources\Jobs\JobResource
     */
    public function update(UpdateJobsRequest $request, Job $job)
    {
        $data = $request->all();
        $updated = $this->jobService->update($job, [
            ...$data,
            'status' => isset($data['draft']) && $data['draft'] === true ? JobStatusEnum::DRAFT : JobStatusEnum::OPEN,
        ]);
        return new JobResource($updated);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Jobs\Job $job
     * @return JobResource
     */
    public function destroy(Job $job)
    {
        $job->trashed() ? $job->restore() : $job->delete();
        return new JobResource($job);
    }

    public function callCandidates(Request $request)
    {
        $jobs = $request->post('jobs');
        $candidates = $request->post('candidates');

        $this->jobService->callCandidates($jobs, $candidates);
    }

    public function apply(Request $request, Job $job)
    {
        /** @var User */
        $user = Auth::user();
        $this->jobService->apply($job, $user);

        return response()->json(['message' => 'Candidatura enviada com sucesso'], 201);
    }

    public function updateStatus(Request $request)
    {
        $job = Job::find($request->get('job'));
        $candidate = Candidate::find($request->get('candidate'));
        $status = $request->get('status');

        $interviewDate = $request->get('date');
        $interviewHour = $request->get('hour');

        return response()->json(['updated' => $this->jobService->updateStatus($job, $candidate, $status, $interviewDate, $interviewHour)]);
    }

    public function updateJobStatus(UpdateJobStatusRequest $request, Job $job)
    {
        $data = $request->validated();
        $updated = $this->jobService->updateJobStatus($job, $data['status']);
        return new JobResource($updated);
    }

    public function storeInvite(StoreInterviewInviteRequest $request, Job $job)
    {
        $data = $request->validated();
        $invite = $this->jobService->createInvite($job, $data);

        response()->json([$invite]);
    }

    public function interviewInvites()
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;

        if ($roleId !== RolesEnum::CANDIDATE->value) {
            return response()->json(['message' => 'Só candidatos podem ver os convites para entrevista']);
        }
        $invites = $this->jobService->getUserInterviewInvites($user->candidate->id);

        return response()->json(InterviewInviteResource::collection($invites));
    }

    public function updateJobInterview(UpdateJobInterviewRequest $request, JobInterviewInvite $jobInterview)
    {
        $data = $request->validated();
        $user = Auth::user();
        $roleId = $user->roles[0]->id;

        if ($roleId !== RolesEnum::CANDIDATE->value) {
            return response()->json(['message' => 'Só candidatos podem aceitar ou recusar convites para entrevista']);
        }
        $invite = $this->jobService->updateJobInterview([...$data, 'candidateId' => $user->candidate->id], $jobInterview);

        return response()->json(new InterviewInviteResource($invite));
    }
}
