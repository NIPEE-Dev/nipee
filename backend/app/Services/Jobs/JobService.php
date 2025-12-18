<?php

namespace App\Services\Jobs;

use App\Beans\MailTask;
use App\Enums\ActiveEnum;
use App\Enums\CandidateStatusEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Enums\JobCandidateStatusEnum;
use App\Enums\JobInterviewInviteStatusEnum;
use App\Enums\JobStatusEnum;
use App\Enums\RolesEnum;
use App\Enums\UserCandidateStatusEnum;
use App\Jobs\SendMail;
use App\Mail\AcceptInterviewMail;
use App\Mail\CandidateCalledMail;
use App\Mail\JobApproved;
use App\Mail\JobDenied;
use App\Mail\JobInterviewInviteMail;
use App\Mail\NotifyJobApply;
use App\Models\Candidate;
use App\Models\JobInterviewInvite;
use App\Models\Jobs\Job;
use App\Models\Jobs\JobCandidate;
use App\Models\Users\User;
use App\Services\Documents\WordProcessor;
use App\Traits\Common\Filterable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            if (is_array($data['courses']) && count($data['courses']) > 0) {
                $jobCity = $job->company->address->city;
                $candidates = Candidate::query()
                    ->with('user')
                    ->where(function ($q) {
                        $q->orWhereDoesntHave('contracts')->orWhereHas('contracts', function ($query) {
                            $query->where('status', ActiveEnum::NOT_ACTIVE->value);
                        });
                    })
                    ->whereHas('address', function ($q) use ($jobCity) {
                        $q->where('city', $jobCity);
                    })
                    ->whereIn('course', $data['courses'])->get();

                $emails = $candidates->pluck('user.email');
            }

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

            if ($status === JobCandidateStatusEnum::APPROVED->value) {
                $max = $job->max_approvals;
                $approvedCandidates = $job->candidates->where(function ($q) {
                    return $q->pivot->status === intval(JobCandidateStatusEnum::APPROVED->value);
                });
                if (count($approvedCandidates) === $max) {
                    $job->status = JobStatusEnum::CLOSED;
                    $job->save();
                }
            }

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

        if (
            $user->candidate->status === UserCandidateStatusEnum::CONCLUDED ||
            $user->candidate->status === UserCandidateStatusEnum::IN_FCT ||
            $user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first() !== null
        ) throw new HttpException(400, 'Você não pode se candidatar a outras vagas');

        $alreadyApplied = $job->candidates->where('id', $user->candidate->id)->first();
        if ($alreadyApplied) throw new HttpException(400, 'Você já se candidatou nessa vaga');

        Mail::to($job->company->user->email)->send(new NotifyJobApply($user->candidate->name, $job->company->user->company->corporate_name, $job->role));

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

            if ($data['confirmed']) {
                $schedule->accepted = true;
            }

            $schedule->save();

            $candidate = $jobInterview->job->candidates->where('id', $data['candidateId'])->first();
            $candidate->pivot->status = $data['confirmed'] ? JobCandidateStatusEnum::INTERVIEWING : JobCandidateStatusEnum::INTERVIEW_REJECT_BY_USER;
            $candidate->pivot->save();

            if ($data['confirmed']) {
                try {
                    $interviewDatetime = new Carbon($schedule->date);
                    $interviewDatetime->setTimeFromTimeString($schedule->time);
                    $candidateModel = Candidate::query()->where('id', $data['candidateId'])->first();

                    try {
                        Mail::to($candidateModel->user->email)->send(new AcceptInterviewMail($candidateModel->name, $interviewDatetime->format('d/m/Y H:i')));
                        Mail::to($jobInterview->job->company->user->email)->send(new AcceptInterviewMail($candidateModel->name, $interviewDatetime->format('d/m/Y H:i')));
                    } catch (\Throwable $th) {
                    }
                } catch (\Exception $mailTh) {
                    report($mailTh);
                }
            }

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
            $interview = JobInterviewInvite::query()->where('candidate_id', $data['candidateId'])->where('job_id', $data['jobId'])->first();
            if (isset($interview)) $interview->update(['interview_evaluation' => $data['interviewEvaluation']]);
            $job = Job::query()->where('id', $data['jobId'])->first();

            $candidate = $job->candidates->where('id', $data['candidateId'])->first();
            $candidate->pivot->status = $data['approved'] ? JobCandidateStatusEnum::APPROVED : JobCandidateStatusEnum::DENIED;
            if ($data['approved']) {
                Mail::to($candidate->user->email)->send(new JobApproved($candidate->name, $interview->job->role));
                $max = $job->max_approvals;
                $approvedCandidates = $job->candidates->where(function ($q) {
                    return $q->pivot->status === intval(JobCandidateStatusEnum::APPROVED->value);
                });
                if ((count($approvedCandidates) + 1) === $max) {
                    $job->status = JobStatusEnum::FULL;
                    $job->save();
                }
            } else {
                Mail::to($candidate->user->email)->send(new JobDenied($candidate->name, $job->role));
            }
            $candidate->pivot->save();
            DB::commit();
            return $job;
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
            $interview = JobInterviewInvite::query()->where('candidate_id', $data['candidateId'])->where('job_id', $data['jobId'])->first();
            $interview->update(['testing_evaluation' => $data['testingEvaluation']]);

            $candidate = $interview->job->candidates->where('id', $data['candidateId'])->first();
            $candidate->pivot->status = $data['approved'] ? JobCandidateStatusEnum::APPROVED : JobCandidateStatusEnum::DENIED;

            if ($data['approved']) {
                $job = $interview->job;
                $max = $job->max_approvals;
                $approvedCandidates = $job->candidates->where(function ($q) {
                    return $q->pivot->status === intval(JobCandidateStatusEnum::APPROVED->value);
                });
                if ((count($approvedCandidates) + 1) === $max) {
                    $job->status = JobStatusEnum::FULL;
                    $job->save();
                }
            }

            $candidate->pivot->save();
            DB::commit();
            return $interview;
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }

    public function inviteToJob(Job $job, $data)
    {
        try {
            DB::beginTransaction();
            $candidateId = $data['candidateId'];
            $alreadyApplied = $job->candidates->where('id', $candidateId)->first();
            if (isset($alreadyApplied)) throw new HttpException(400, 'Esse candidato já participa dessa vaga');

            $candidate = Candidate::query()->where('id', $candidateId)->first();
            $job->candidates()->attach($candidate, ['status' => JobCandidateStatusEnum::WAITING_RESPONSE]);

            $invite = $job->invites()->create([
                'candidate_id' => $candidateId,
                'message' => $data['message']
            ]);

            $invite->schedule()->createMany($data['schedules']);

            Mail::to($candidate->user->email)->send(new JobInterviewInviteMail($candidate, $invite));

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            throw $th;
        }
    }

    public function get()
    {
        return Job::query()->where('show_web', '1')->paginate(9999);
    }
}
