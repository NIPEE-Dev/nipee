<?php

namespace App\Services\Jobs;

use App\Beans\MailTask;
use App\Enums\CandidateStatusEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Enums\JobCandidateStatusEnum;
use App\Enums\JobInterviewInviteStatusEnum;
use App\Enums\JobStatusEnum;
use App\Enums\RolesEnum;
use App\Jobs\SendMail;
use App\Mail\CandidateCalledMail;
use App\Mail\JobInterviewInviteMail;
use App\Models\Candidate;
use App\Models\JobInterviewInvite;
use App\Models\Jobs\Job;
use App\Models\Jobs\JobCandidate;
use App\Models\Users\User;
use App\Services\Documents\WordProcessor;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JobService
{
    use Filterable;

    public function __construct(public WordProcessor $wordProcessor) {}

    public function index($criteria)
    {
        $builder = Job::query()->with(['workingDay', 'company.address', 'role']);
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        if ($roleId === RolesEnum::CANDIDATE->value) {
            $builder->where('status', JobStatusEnum::OPEN->value);
        }

        if (!isset($criteria['withoutTrashed'])) {
            $builder->withTrashed();
        }

        if ($companyId = Arr::get($criteria, 'company_id')) {
            $builder->where('company_id', '=', $companyId);
        }
        $data = $this->applyCriteria($builder, $criteria);
        $user = Auth::user();
        if ($user->roles[0]->id === 14) {
            $data->where('company_id', $user->company->id);
        }
        return $data->paginate(Arr::get($criteria, 'perPage', 10));
    }

    public function store($data)
    {
        return tap(Job::create($data), function (Job $job) use ($data) {
            $job->courses()->sync($data['courses']);
            $job->workingDay()->create(Arr::get($data, 'working_day'));

            return $job->load(['workingDay', 'company', 'documents']);
        });
    }

    public function update(Job $job, $data)
    {
        $job->update($data);

        if ($workingData = Arr::get($data, 'working_day')) {
            $job->workingDay()->update($workingData);
        }
        if (isset($data['courses'])) {
            $job->courses()->sync($data['courses']);
        }

        return $job->load(['workingDay', 'company.address', 'documents']);
    }

    public function callCandidates($jobs, $candidates)
    {
        $jobs = Job::whereIn('id', $jobs)->get();

        foreach ($jobs as $job) {
            $job->candidates()->syncWithoutDetaching($candidates);

            foreach ($candidates as $candidate) {
                $candidateEntity = Candidate::find($candidate);
                if ($candidateEntity && $candidateEntity->hasActiveContract()) {
                    continue;
                }

                $job->history()->create([
                    'candidate_id' => $candidate,
                    'status' => 1
                ]);
            }
        }

        $this->dispatchEmails($candidates, $jobs);
    }

    private function dispatchEmails($candidates, $jobs): void
    {
        $candidates = Candidate::whereIn('id', $candidates)->get();
        foreach ($candidates as $candidate) {
            if (isset($candidate->contact->email)) {
                SendMail::dispatch(new MailTask($candidate->contact->email, new CandidateCalledMail("Você foi selecionado no primeiro nível de algumas oportunidades!", $jobs)));
            }
        }
    }

    public function updateStatus(Job $job, Candidate $candidate, ?string $status, ?string $interviewDate, ?string $interviewHour)
    {
        return DB::transaction(function () use ($job, $candidate, $status, $interviewDate, $interviewHour) {
            $job->candidates()->updateExistingPivot(
                $candidate->id,
                $status ? [
                    'status' => $status
                ] : [
                    'disapproved' => '1'
                ]
            );

            return $job->history()->create([
                'candidate_id' => $candidate->id,
                'status' => $status !== null ? $status : -1
            ]);
        });
    }

    public function apply(Job $job, User $user)
    {
        $roleId = $user->roles[0]->id;
        if ($roleId !== RolesEnum::CANDIDATE->value) {
            throw new HttpException(400, 'Somente candidatos podem se candidatar em vagas');
        }

        $alreadyApplied = $job->candidates->where('id', $user->candidate->id)->first();
        if ($alreadyApplied) throw new HttpException(400, 'Você já se candidatou nessa vaga');

        $job->candidates()->attach($user->candidate);
    }

    public function updateJobStatus(Job $job, $status)
    {
        $job->status = $status;
        $job->save();

        return $job->load(['workingDay', 'company.address', 'documents']);
    }

    public function getHistory($candidateId)
    {
        $jobs = Job::query()->whereHas('candidates', function (Builder $q) use ($candidateId) {
            $q->where('candidate_id', $candidateId);
        })->paginate(10);

        return $jobs;
    }

    public function createInvite($job, $data)
    {
        try {
            DB::beginTransaction();
            $invite = $job->invites()->create([
                'candidate_id' => $data['candidateId'],
                'message' => $data['message']
            ]);
            $candidate = $job->candidates->where('id', $data['candidateId'])->first();
            if (!isset($candidate)) throw new HttpException(400, 'O candidato selecionado não se candidatou nessa vaga');

            $candidate->pivot->status = JobCandidateStatusEnum::WAITING_RESPONSE;
            $candidate->pivot->save();
            $invite->schedule()->createMany($data['schedules']);

            $candidate = Candidate::where('id', $data['candidateId'])->first();
            if (!isset($candidate)) throw new HttpException(400, 'Candidato não encontrado');

            Mail::to($candidate->user->email)->send(new JobInterviewInviteMail($candidate, $invite));

            DB::commit();

            return $invite;
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }

    public function getUserInterviewInvites($candidateId)
    {
        $invites = JobInterviewInvite::query()->where('candidate_id', $candidateId)->where('status', '!=', JobInterviewInviteStatusEnum::DENIED)->with(['schedule', 'job'])->get();

        return $invites;
    }

    public function updateJobInterview($data, JobInterviewInvite $jobInterview)
    {
        try {
            DB::beginTransaction();
            $schedule = $jobInterview->schedule->where('id', $data['scheduleId'])->first();
            if (!isset($schedule)) throw new HttpException(400, 'Horário não encontrado');

            $schedule->status = $data['confirmed'] ? JobInterviewInviteStatusEnum::ACCEPTED : JobInterviewInviteStatusEnum::DENIED;

            if ($data['confirmed']) $schedule->accepted = true;

            $schedule->save();

            $candidate = $jobInterview->job->candidates->where('id', $data['candidateId'])->first();

            $candidate->pivot->status = $data['confirmed'] ? JobCandidateStatusEnum::INTERVIEWING : JobCandidateStatusEnum::INTERVIEW_REJECT_BY_USER;
            $candidate->pivot->save();

            DB::commit();
            return $jobInterview->fresh(['schedule', 'job.company']);
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }

    public function updateJobInterviewEvaluation($data)
    {
        try {
            DB::beginTransaction();
            $interview = JobInterviewInvite::query()->where('candidate_id', $data['candidateId'])->first();
            $interview->update(['interview_evaluation' => $data['interviewEvaluation']]);

            $candidate = $interview->job->candidates->where('id', $data['candidateId'])->first();
            $candidate->pivot->status = $data['approved'] ? JobCandidateStatusEnum::TESTING : JobCandidateStatusEnum::DENIED;
            $candidate->pivot->save();
            DB::commit();
            return $interview;
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }

    public function updateJobTestingEvaluation($data)
    {
        try {
            DB::beginTransaction();
            $interview = JobInterviewInvite::query()->where('candidate_id', $data['candidateId'])->first();
            $interview->update(['testing_evaluation' => $data['testingEvaluation']]);

            $candidate = $interview->job->candidates->where('id', $data['candidateId'])->first();
            $candidate->pivot->status = $data['approved'] ? JobCandidateStatusEnum::APPROVED : JobCandidateStatusEnum::DENIED;
            $candidate->pivot->save();
            DB::commit();
            return $interview;
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }
}
