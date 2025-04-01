<?php

namespace App\Services\Jobs;

use App\Beans\MailTask;
use App\Enums\CandidateStatusEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Jobs\SendMail;
use App\Mail\CandidateCalledMail;
use App\Models\Candidate;
use App\Models\Jobs\Job;
use App\Services\Documents\WordProcessor;
use App\Traits\Common\Filterable;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobService
{
    use Filterable;

    public function __construct(public WordProcessor $wordProcessor)
    {
    }

    public function index($criteria)
    {
        $builder = Job::query()->with(['workingDay', 'company.address', 'role']);

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

            if ($status === CandidateStatusEnum::FORWARDED->value) {
                $dateTime = Carbon::parse($interviewDate . ' ' . $interviewHour);
                $company = $job->company;
                $companyAddress = $company->address;

                $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::FORWARDED, [
                    'nomeCandidato' => $candidate->name,
                    'nomeEmpresa' => $company->fantasy_name,
                    'nomeEmpresa2' => $company->corporate_name,
                    'enderecoEmpresa' => $companyAddress->address,
                    'numeroEmpresa' => $companyAddress->district,
                    'bairroEmpresa' => $companyAddress->number,
                    'cidadeEmpresa' => $companyAddress->city,
                    'estadoEmpresa' => strtoupper($companyAddress->uf),
                    'complemento' => $companyAddress->complement,

                    'horarioEntrevista' => $dateTime->format("H:i"),
                    'dataEntrevista' => $dateTime->format("d/m/Y"),

                    'supervisor' => $company->supervisor,
                    'telefoneEmpresa' => $company->contact->phone,
                    'observacao' => $candidate->candidate_observations,
                    'funcao' => $job->role->title,
                    'data' => now()->translatedFormat("d \\d\\e F \\d\\e Y"),
                    'supervisor2' => $company->supervisor,
                    'nomeCandidato2' => $candidate->name,
                    'cpf' => $candidate->cpf,
                    'funcao2' => $job->role->title,
                    'bolsa' => $job->scholarship_value,
                    'jornada' => journeyText($job->workingDay),
                ]);

                $fileData = [
                    'filename' => $generatedDocument['randomName'],
                    'original_filename' => $generatedDocument['filename'],
                    'file_extension' => 'docx',
                    'filesize' => $generatedDocument['filesize'],
                    'type' => 'Carta de encaminhamento',
                ];

                $job->documents()->create($fileData);
            }

            return $job->history()->create([
                'candidate_id' => $candidate->id,
                'status' => $status !== null ? $status : -1
            ]);
        });
    }
}
