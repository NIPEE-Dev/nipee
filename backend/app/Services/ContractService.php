<?php

namespace App\Services;

use App\Enums\ActiveEnum;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Enums\Company\TypeEnum;
use App\Enums\Document\DocumentStatusEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Enums\Financial\Company\TaxEnum;
use App\Exceptions\ApplicationException;
use App\Helpers\Filter;
use App\Models\Candidate;
use App\Models\Contracts\Contract;
use App\Models\Insurance\Settings;
use App\Models\Jobs\Job;
use App\Services\Documents\WordProcessor;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Enums\PeriodEnum;
use App\Traits\Common\IsAdmin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    use Filterable;
    use IsAdmin;

    public function __construct(public WordProcessor $wordProcessor) {}

    private function getUf($uf)
    {
        $districtName = [
            'av' => 'Aveiro',
            'ac' => 'Açores',
            'be' => 'Beja',
            'br' => 'Braga',
            'bg' => 'Bragança',
            'cb' => 'Castelo Branco',
            'co' => 'Coimbra',
            'ev' => 'Évora',
            'fa' => 'Faro',
            'gu' => 'Guarda',
            'le' => 'Leiria',
            'li' => 'Lisboa',
            'po' => 'Portalegre',
            'pr' => 'Porto',
            'sa' => 'Santarém',
            'se' => 'Setúbal',
            'vc' => 'Viana do Castelo',
            'vr' => 'Vila Real',
            'vi' => 'Viseu',
            'az' => 'Açores',
            'ma' => 'Madeira',
        ];

        return $districtName[$uf] ?? $uf;
    }

    public function index($criteria)
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;

        $this->addSpecialField('status', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->where('status', '=', '0'),
                1 => $builder->where('status', '=', '1')->where('end_contract_vigence', '>=', date('Y-m-d') . ' 00:00:00'),
                2 => $builder->where('status', '=', '1')
                    ->where('end_contract_vigence', '>=', date('Y-m-d') . ' 00:00:00')
                    ->where('end_contract_vigence', '<=', date('Y-m-d', strtotime('+30 days')) . ' 23:59:59'),
                3 => $builder->where('status', '=', '1')->where('end_contract_vigence', '<', date('Y-m-d')),
            };
        });

        $this->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->whereHas('candidate', function (Builder $builder) {
                    $builder->whereRaw("MONTH(birth_day) = " . date("n"));
                }),
                1 => $builder->whereHas('candidate', function (Builder $builder) {
                    $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")));
                })
            };
        });

        $data = $this->applyCriteria(Contract::query()->with('school', 'candidate', 'company', 'job'), $criteria);

        if ($roleId === 13) {
            $data->where('candidate_id', $user->candidate->id ?? 0);
        }
        if ($user->roles[0]->id === 14) {
            $data->where('company_id', $user->company->id);
        }
        if ($roleId === 10) {
            $data->where('school_id', $user->school[0]->id ?? 0);
        }

        return $data->paginate(Arr::get($criteria, 'perPage', 10));
    }

    /**
     * @throws ApplicationException
     */
    public function store($data)
    {
        $candidateID = $data['candidate']['id'] ?? $data['candidate']['name'];
        $candidate = Candidate::find($candidateID);

        if (!$candidate || $candidate->hasActiveContract()) {
            throw new ApplicationException("Este candidato já possuí contrato ativo");
        }

        $contractData = array_merge($data, [
            'job_id' => $data['job']['id'] ?? $data['job_id'],
            'company_id' => $data['job']['company']['id'] ?? $data['company_id'],
            'school_id' => $data['candidate']['school']['id'] ?? $data['school']['id'],
            'candidate_id' => $candidateID,
        ]);

        return DB::transaction(fn() => tap(Contract::create($contractData), function (Contract $contract) use ($data) {
            $job = Arr::get($data, 'job');
            $userAddress = Arr::get($data, 'userAddress');
            $jobAddress = $contract->company->address;
            $jobOtherAddress = Arr::get($data, 'jobOtherAddress');
            $candidate = Arr::get($data, 'candidate');
            $candidateAddress = $candidate['address'];

            if (isset($data['job_id']) || isset($data['job']['id'])) {
                $jobID = $data['job_id'] ?? $data['job']['id'];
                $job['role'] = Job::find($jobID)->role;
            } else {
                $job['role'] = $job['role']['title'];
            }

            $contract->company->tax()->create(['type' => TaxEnum::ACCESSION, 'contract_id' => $contract->id]);

            $contract->job()->create(Arr::only($job, [
                'role',
                'scholarship_value',
                'scholarship_nominal_value',
                'transport_voucher',
                'transport_voucher_value',
                'transport_voucher_nominal_value',
                'fct_hours',
            ]));

            $contract->userAddress()->create([...$userAddress, ...['custom_type' => 'userAddress']]);

            $contract->workingDay()->create(Arr::only(Arr::get($data, 'working_day'), [
                'start_weekday',
                'end_weekday',
                'start_hour',
                'end_hour',
                'day_off_start_weekday',
                'day_off_start_hour',
                'day_off_end_hour',
                'day_off',
                'working_hours',
            ]));

            $candidate['name'] = $candidate['nameOriginal'];
            $candidate = $contract->candidate()->create($candidate);
            $candidate->contact()->create(Arr::get($data, 'candidate.contact'));
            $contract->load(['candidate', 'company.address', 'school.address', 'job']);

            if (! $contract->school || ! $contract->school->address) {
                throw new \RuntimeException(
                    "A escola necessita de uma morada válida para realizar o protocolo."
                );
            }

            if (! $contract->company || ! $contract->company->address) {
                throw new \RuntimeException(
                    "A empresa necessita de uma morada válida para realizar o protocolo."
                );
            }

            $anoAtual = date('Y');
            $anoLetivo = $anoAtual . '/' . ($anoAtual + 1);

            $data = [
                'razaoSocialEscola' => $contract->school->corporate_name,
                'cnpjEscola' => $contract->school->cnpj,
                'enderecoEscola' => $contract->school->address->address,
                'bairroEscola' => $contract->school->address->district,
                'numeroEscola' => $contract->school->address->number,
                'cidadeEscola' => $contract->school->address->city,
                'estadoEscola' => strtoupper($contract->school->address->uf),
                'cepEscola' => $contract->school->address->cep,
                'responsavelEscola' => $contract->school->responsible?->name,
                'responsavelFuncaoEscola' => $contract->school->responsible?->role,
                'telefoneEscola' => $contract->school->responsible?->phone,

                'razaoSocialEmpresa' => $contract->company->corporate_name,
                'cnpjEmpresa' => $contract->company->cnpj,
                'caeEmpresa' => $contract->company->cae,
                'supervisorEmpresa' => $contract->supervisor,
                'funcaoSupervisorEmpresa' => $contract->funcao,
                'telefoneEmpresa' => $contract->company->responsible?->phone,
                'emailEmpresa' => $contract->company->responsible?->email,

                'enderecoEmpresa' => $jobAddress->address,
                'numeroEmpresa' => $jobAddress->number,
                'bairroEmpresa' => $jobAddress->district,
                'cidadeEmpresa' => $jobAddress->city,
                'estadoEmpresa' => strtoupper($jobAddress->uf),
                'ufEmpresa' => $this->getUf($jobAddress->uf),
                'cepEmpresa' => $jobAddress->cep,

                'anos' => "${anoLetivo}",

                'period' => PeriodEnum::getLabel(PeriodEnum::from($job['period'])),

                'nomeCandidato' => $candidate->name,
                'nascimentoCandidato' => $candidate->birth_day,
                'cpfCandidato' => $candidate->cpf,
                'cursoCandidato' => $candidate->userCourse?->title ?? 'Ensino Secundário',
                'nivelCandidato' => StudyingLevelEnum::getLabel($candidate['studying_level']),
                'rgCandidato' => $candidate->rg,
                'enderecoCandidato' => $candidateAddress['address'] ?? '3123131',
                'numeroCandidato' => $userAddress['number'],
                'bairroCandidato' => $userAddress['district'],
                'cidadeCandidato' => $userAddress['city'],
                'estadoCandidato' => strtoupper($userAddress['uf']),
                'cepCandidato' => $userAddress['cep'],
                'estagioObrigatorio' => $candidate->mandatory_internship == '1' ? 'Obrigatório' : 'Não obrigatório',

                //'apolice' => Settings::query()->first()->apolice,

                // checar da onde vem o estagio obrigatorio e dps substituir aqui
                'estagio' => 'Estágio',
                'fctHours' => $contract->job->fct_hours ?? 0,
                'funcao' => $contract->job->role,
                'dataInicial' => $contract->start_contract_vigence->format("d/m/Y"),
                'dataFinal' => $contract->end_contract_vigence->format("d/m/Y"),
                'bolsa' => "R$ " . number_format($contract->job->scholarship_value, 2, ",", "."),
                'jornada' => strtolower(journeyText($contract->workingDay)),
                'supervisor' => $contract->supervisor,
                'razaoSocialEmpresa2' => $contract->company->corporate_name,
                'razaoSocialEscola2' => $contract->school->corporate_name,
                'nomeCandidato2' => $candidate->name,
                'data' => $contract->start_contract_vigence->translatedFormat("d \\d\\e F \\d\\e Y"),

                'manual_contract_upload' => Arr::get($data, 'manual_contract_upload', false),
                'manual_contract_file' => Arr::get($data, 'manual_contract_file', null),
            ];

            if ($contract->job->transport_voucher == '1') {
                $data['valorNominal'] = (int)$contract->job->transport_voucher_value === 0
                    ? $contract->job->scholarship_nominal_value . ' + VT'
                    : $contract->job->scholarship_nominal_value . " + VALE TRANSPORTE: R$ " . number_format($contract->job->transport_voucher_value, 2, ",", ".") . " (" . $contract->job->transport_voucher_nominal_value . ")";
            } else {
                $data['valorNominal'] = $contract->job->scholarship_nominal_value;
            }

            // if/else to avoid nested ternary operator
            if ($contract->company->type === TypeEnum::PJ) {
                $data['ieEmpresa'] = $contract->company->municipal_registration;
            } else {
                $data['ieEmpresa'] = $contract->company->oab ? "INSCRITA NA OAB/SP SOB N°: {$contract->company->oab} E CRCSP N° {$contract->company->crcsp}" : '';
            }

            if ($candidate->studying_level === StudyingLevelEnum::COLLEGE) {
                $data['serie'] = sprintf("%s° semestre do curso de %s de nível SUPERIOR", ++$candidate->semester, $candidate->userCourse?->title);
            } elseif ($candidate->studying_level === StudyingLevelEnum::TECHNICAL_EDUCATION) {
                $data['serie'] = sprintf("%s° semestre do curso de %s de nível TÉCNICO", ++$candidate->semester, $candidate->userCourse?->title);
            } else {
                $data['serie'] = $candidate->formattedSerie();
            }

            $deleteOtherAddressBlock = true;
            if (isset(
                $jobOtherAddress['address'],
                $jobOtherAddress['number'],
                $jobOtherAddress['district'],
                $jobOtherAddress['city'],
                $jobOtherAddress['uf'],
                $jobOtherAddress['cep']
            )) {
                $data['other_enderecoEmpresa'] = $jobOtherAddress['address'];
                $data['other_numeroEmpresa'] = $jobOtherAddress['number'];
                $data['other_bairroEmpresa'] = $jobOtherAddress['district'];
                $data['other_cidadeEmpresa'] = $jobOtherAddress['city'];
                $data['other_estadoEmpresa'] = strtoupper($jobOtherAddress['uf']);
                $data['other_cepEmpresa'] = $jobOtherAddress['cep'];

                $contract->jobOtherAddress()->create([...$jobOtherAddress, ...['custom_type' => 'jobOtherAddress']]);
                $deleteOtherAddressBlock = false;
            }


            if ((isset($data['manual_contract_upload']) && $data['manual_contract_upload'] === true) && isset($data['manual_contract_file'])) {
                $contractFile = $data['manual_contract_file'];
                $fileData = substr($contractFile, strpos($contractFile, ',') + 1);
                $fileMimeType = explode(';', explode(':', $contractFile)[1])[0];

                $fileContents = base64_decode($fileData);
                $fileExtension = $fileMimeType == 'application/pdf' ? 'pdf' : 'docx';
                $fileName = uniqid();

                $path = Storage::disk('local')->put('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension, $fileContents);

                $contract->documents()->create([
                    'filename' => $fileName,
                    'original_filename' => $fileName,
                    'file_extension' => $fileExtension,
                    'filesize' => Storage::disk('local')->size('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension),
                    'type' => 'Protocolo Manual',
                    'status' => DocumentStatusEnum::PENDING_SCHOOL_SIGNATURE,
                ]);
            } else {
                $generatedDocument = $this->wordProcessor->make(
                    $contract->company->type === TypeEnum::PJ
                        ? DocumentTypeTemplateEnum::CONTRACT_INTERNSHIP
                        : DocumentTypeTemplateEnum::CONTRACT_INTERNSHIP_CPF,
                    $data,
                    function (TemplateProcessor $templateProcessor) use ($deleteOtherAddressBlock, $jobAddress) {
                        if ($deleteOtherAddressBlock) {
                            $templateProcessor->cloneBlock('blockOtherAddress', 0, true, true);
                        } else {
                            $templateProcessor->cloneBlock('blockOtherAddress', 1, true, false, [
                                [
                                    'other_enderecoEmpresa' => $jobAddress->address,
                                    'other_numeroEmpresa' => $jobAddress->number,
                                    'other_bairroEmpresa' => $jobAddress->district,
                                    'other_cidadeEmpresa' => $jobAddress->city,
                                    'other_estadoEmpresa' => strtoupper($jobAddress->uf),
                                    'other_cepEmpresa' => $jobAddress->cep,
                                ]
                            ]);
                        }
                    }
                );

                $contract->documents()->create([
                    'filename' => $generatedDocument['randomName'],
                    'original_filename' => $generatedDocument['filename'],
                    'file_extension' => 'docx',
                    'filesize' => $generatedDocument['filesize'],
                    'type' => 'Protocolo',
                    'status' => DocumentStatusEnum::PENDING_COMPANY_SIGNATURE,
                ]);
            }

            return $contract->load(['originalJob', 'job', 'workingDay', 'company.address', 'candidate.contact', 'documents', 'userAddress', 'jobOtherAddress']);
        }));
    }

    public function update(Contract $contract, $data)
    {
        $contract->update(Arr::except($data, ['status']));
        $contract->job()->update(Arr::only(Arr::get($data, 'job', []), [
            'role',
            'scholarship_value',
            'scholarship_nominal_value',
            'transport_voucher',
            'transport_voucher_value',
            'transport_voucher_nominal_value'
        ]));
        $contract->workingDay()->update(Arr::only(Arr::get($data, 'working_day', []), [
            'start_weekday',
            'end_weekday',
            'start_hour',
            'end_hour',
            'day_off_start_weekday',
            'day_off_start_hour',
            'day_off_end_hour',
            'day_off',
            'working_hours',
        ]));

        $contract->userAddress->update(Arr::get($data, 'userAddress', []));

        $jobOtherAddress = Arr::get($data, 'jobOtherAddress', []);
        if ($jobOtherAddress !== null && count($jobOtherAddress) > 0) {
            $contract->jobOtherAddress()->updateOrCreate([], [...$jobOtherAddress, ...['custom_type' => 'jobOtherAddress']]);
        }
        $contract->candidate->update(Arr::get($data, 'candidate', []));
        $contract->candidate->contact->update(Arr::get($data, 'candidate.contact', []));

        if ($newCompanyId = Arr::get($data, 'company_id')) {
            if ($newCompanyId != $contract->company->id) {
                $contract->company->tax()->update(['company_id' => $newCompanyId]);
                activity()->log("Atualizou o contrato {$contract->id}: company id antigo: {$contract->company->id}, novo: {$newCompanyId}");
            }
        }

        $contract->documents()->delete();

        $contract->load('company.address', 'school.address', 'candidate', 'candidate.contact', 'job', 'workingDay', 'userAddress', 'jobOtherAddress');

        $school = $contract->school;
        $company = $contract->company;
        $candidate = $contract->candidate;
        $job = Arr::get($data, 'job', []);
        $workingDay = $contract->workingDay;
        $jobAddress = $contract->jobOtherAddress ?? $company->address;
        $userAddress = $contract->userAddress;
        $candidateAddress = $candidate->address ?? [];
        $anoAtual = date('Y');
        $anoLetivo = $anoAtual . '/' . ($anoAtual + 1);

        $periodValue = Arr::get($job, 'period');
        try {
            $periodEnum = $periodValue !== null ? PeriodEnum::from($periodValue) : null;
            $periodLabel = $periodEnum ? PeriodEnum::getLabel($periodEnum) : null;
        } catch (\ValueError $e) {
            $periodLabel = null;
        }

        $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::CONTRACT_INTERNSHIP, [
            'razaoSocialEscola' => $school->corporate_name,
            'cnpjEscola' => $school->cnpj,
            'enderecoEscola' => $school->address->address ?? '',
            'bairroEscola' => $school->address->district ?? '',
            'numeroEscola' => $school->address->number ?? '',
            'cidadeEscola' => $school->address->city ?? '',
            'estadoEscola' => strtoupper($school->address->uf ?? ''),
            'cepEscola' => $school->address->cep ?? '',
            'responsavelEscola' => $school->responsible?->name,
            'responsavelFuncaoEscola' => $school->responsible?->role,
            'telefoneEscola' => $school->responsible?->phone,

            'razaoSocialEmpresa' => $company->corporate_name,
            'cnpjEmpresa' => $company->cnpj,
            'caeEmpresa' => $company->cae,
            'supervisorEmpresa' => $contract->supervisor,
            'funcaoSupervisorEmpresa' => $contract->funcao,
            'telefoneEmpresa' => $company->responsible?->phone,
            'emailEmpresa' => $company->responsible?->email,

            'enderecoEmpresa' => $jobAddress->address ?? '',
            'numeroEmpresa' => $jobAddress->number ?? '',
            'bairroEmpresa' => $jobAddress->district ?? '',
            'cidadeEmpresa' => $jobAddress->city ?? '',
            'estadoEmpresa' => strtoupper($jobAddress->uf ?? ''),
            'cepEmpresa' => $jobAddress->cep ?? '',

            'anos' => (string) $anoLetivo,

            'period' => $periodLabel,

            'nomeCandidato' => $candidate->name,
            'nascimentoCandidato' => $candidate->birth_day,
            'cpfCandidato' => $candidate->cpf,
            'cursoCandidato' => $candidate->userCourse?->title ?? 'Ensino Secundário',
            'nivelCandidato' => StudyingLevelEnum::getLabel($candidate->studying_level ?? null),
            'rgCandidato' => $candidate->rg,
            'enderecoCandidato' => $candidateAddress['address'] ?? '',
            'numeroCandidato' => $userAddress->number ?? '',
            'bairroCandidato' => $userAddress->district ?? '',
            'cidadeCandidato' => $userAddress->city ?? '',
            'estadoCandidato' => strtoupper($userAddress->uf ?? ''),
            'cepCandidato' => $userAddress->cep ?? '',
            'estagioObrigatorio' => $candidate->mandatory_internship == '1' ? 'Obrigatório' : 'Não obrigatório',

            'estagio' => 'Estágio',
            'funcao' => $contract->job->role,
            'dataInicial' => $contract->start_contract_vigence->format("d/m/Y"),
            'dataFinal' => $contract->end_contract_vigence->format("d/m/Y"),
            'bolsa' => "R$ " . number_format($contract->job->scholarship_value, 2, ",", "."),
            'jornada' => strtolower(journeyText($workingDay)),
            'supervisor' => $contract->supervisor,
            'razaoSocialEmpresa2' => $company->corporate_name,
            'razaoSocialEscola2' => $school->corporate_name,
            'nomeCandidato2' => $candidate->name,
            'data' => $contract->start_contract_vigence->translatedFormat("d \\d\\e F \\d\\e Y"),
        ]);

        $contract->documents()->create([
            'filename' => $generatedDocument['randomName'],
            'original_filename' => $generatedDocument['filename'],
            'file_extension' => 'docx',
            'filesize' => $generatedDocument['filesize'],
            'type' => 'Protocolo',
        ]);

        return $contract->load(['originalJob', 'job', 'workingDay', 'company.address', 'candidate.contact', 'documents', 'userAddress', 'jobOtherAddress']);
    }

    public function destroy(Contract $contract, $motive, $payCurrentMonth, $terminatedAt): JsonResponse
    {
        if ($contract->isActive()) {
            return $this->disableContract($contract, $terminatedAt, $motive, $payCurrentMonth);
        }

        return $this->reactiveContract($contract);
    }

    private function reactiveContract(Contract $contract): JsonResponse
    {
        $candidate = $contract->candidate;

        if ($candidate->hasActiveContract()) {
            throw new ApplicationException("Este candidato já possuí contrato ativo");
        }

        $contract->reactive();

        $builder = $contract
            ->tax()
            ->where(function ($builder) {
                $builder->where('type', '=', TaxEnum::RECOLOCATION)
                    // a única forma de existir uma taxa de mensalidade fora do fechamento é caso tenha marcado que precisa pagar o
                    // mês atual na rescisão, então como esta reativando, precisa apagar essa taxa senão no fechamento
                    // vai aparecer 2 mensalidades
                    ->orWhere('type', '=', TaxEnum::MONTHLY_PAYMENT);
            });

        if ($builder->exists()) {
            $builder->delete();
        }

        return new JsonResponse(['restored' => true]);
    }

    private function disableContract(Contract $contract, $terminatedAt, $motive, $payCurrentMonth): JsonResponse
    {
        $contract->update([
            'status' => ActiveEnum::NOT_ACTIVE,
            'terminated_at' => $terminatedAt,
            'end_contract_reason_id' => $motive,
            'pay_current_month' => $payCurrentMonth ? '1' : '0'
        ]);

        $company = $contract->company;
        $school = $contract->school;
        $candidate = $contract->candidate;

        $contractDurationInDays = now()->diff($contract->start_contract_vigence)->days;
        if ($contractDurationInDays <= 30) {
            $contract->company->tax()->create(['type' => TaxEnum::RECOLOCATION, 'contract_id' => $contract->id]);
        }

        if ($payCurrentMonth) {
            $contract->company->tax()->create(['type' => TaxEnum::MONTHLY_PAYMENT, 'contract_id' => $contract->id]);
        }

        $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::TERMINATION, [
            'razaoSocial' => $company->corporate_name,
            'cnpj' => $company->cnpj,
            'nome' => $candidate->name,
            'cpf' => $candidate->cpf,
            'dataInicio' => $contract->start_contract_vigence->format("d/m/Y"),
            'dataRescisao' => date("d/m/Y", strtotime($terminatedAt)),
            'razaoSocialEscola' => $school->corporate_name,
            'razaoSocialEmpresa' => $company->corporate_name,
            'nomeEstagiario' => $candidate->name,
            'motivo' => $contract->reasonForTermination?->title,
            'data' => now()->translatedFormat("d \\d\\e F \\d\\e Y"),
        ]);

        $contract->documents()->create([
            'filename' => $generatedDocument['randomName'],
            'original_filename' => $generatedDocument['filename'],
            'file_extension' => 'docx',
            'filesize' => $generatedDocument['filesize'],
            'type' => 'Rescisão',
        ]);

        $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::EVALUATION_FORM, [
            'nomeEstagiario' => $candidate->name,
            'nomeEmpresa' => $company->corporate_name,
            'ramoAtividade' => $contract->job->role,
            'cnpj' => $company->cnpj,
            'curso' => $candidate->studying_level === StudyingLevelEnum::HIGH_SCHOOL
                ? StudyingLevelEnum::getLabel($candidate->studying_level)
                : $candidate->userCourse?->title,
            'dataInicial' => $contract->start_contract_vigence->format("d/m/Y"),
            'dataTermino' => date("d/m/Y", strtotime($terminatedAt)),
            'mes' => now()->translatedFormat('F'),
            'ano' => date('Y'),
        ]);

        $fileData = [
            'filename' => $generatedDocument['randomName'],
            'original_filename' => $generatedDocument['filename'],
            'file_extension' => 'docx',
            'filesize' => $generatedDocument['filesize'],
            'type' => 'Ficha de avaliação',
        ];

        $contract->documents()->create($fileData);
        return new JsonResponse(['canceled' => true]);
    }
}
