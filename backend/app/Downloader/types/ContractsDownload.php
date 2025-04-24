<?php

namespace App\Downloader\types;

use App\Downloader\DownloadReplaceHelper;
use App\Downloader\IDownladableContent;
use App\Downloader\IDownloaderDefinition;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Enums\GenderEnum;
use App\Enums\InterestEnum;
use App\Enums\PeriodEnum;
use App\Helpers\Filter;
use App\Models\Contracts\Contract;
use App\Services\FiltersService;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ContractsDownload extends BaseTypeDownload implements IDownloaderDefinition
{
    use Filterable;

    public function definition(IDownladableContent $content)
    {
        $maritalStatus = [
            'S' => 'Solteiro',
            'C' => 'Casado',
            'V' => 'Viúvo',
            'D' => 'Divorciado',
        ];

        return Collection::make($content->getRow())->map(function ($value, $key) use ($maritalStatus) {
            DownloadReplaceHelper::exact($key, 'status', $value, fn() => $value ? 'Ativo' : 'Inativo');
            DownloadReplaceHelper::exact($key, 'candidate.marital_status', $value, fn() => $maritalStatus[$value] ?? '');
            DownloadReplaceHelper::from($key, 'period', $value, fn() => PeriodEnum::getLabel(PeriodEnum::from($value)));
            DownloadReplaceHelper::from($key, 'gender', $value, fn() => GenderEnum::getLabel(GenderEnum::from($value)));
            DownloadReplaceHelper::from($key, 'job.type', $value, fn() => $value === 'ES' ? 'Estágio' : 'FCT');
            DownloadReplaceHelper::from($key, 'studying_level', $value, fn() => StudyingLevelEnum::getLabel(StudyingLevelEnum::from($value)));
            DownloadReplaceHelper::from($key, 'interest', $value, fn() => InterestEnum::getLabel(InterestEnum::from($value)));
            return $value;
        })->toArray();
    }

    public function model(): string
    {
        return Contract::class;
    }

    public function relations(): array
    {
        return ['company', 'school', 'candidate.address', 'job', 'userAddress', 'workingDay', 'reasonForTermination', 'jobOtherAddress'];
    }

    public function internalization(): string
    {
        return 'Contratos';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Nome da empresa' => $row['company.corporate_name'],
            'Nome da escola' => $row['school.corporate_name'],
            'Vaga' => $row['job.role'],

            'Candidato' => '', // vazio só pra separar no excel
            'Nome do candidato' => $row['candidate.name'],
            'Data de nascimento' => $row['candidate.birth_day'],
            'CPF' => $row['candidate.cpf'],
            'RG' => $row['candidate.rg'],
            'Género' => $row['candidate.gender'],
            'Tipo de ensino' => $row['candidate.studying_level'],
            'Curso' => $row['candidate.course'],
            'Semestre' => $row['candidate.semester'],
            'RA' => $row['candidate.ra'],
            'Período' => $row['candidate.period'],
            'Escola' => $row['school.corporate_name'],
            'Interesse' => $row['candidate.interest'],

            'Morada do Candidato' => '', // vazio só pra separar no excel
            'CEP' => $row['userAddress.cep'] ?? '',
            'Estado' => $row['userAddress.uf'] ?? '',
            'Cidade' => $row['userAddress.city'] ?? '',
            'Rua' => $row['userAddress.street'] ?? '',
            'Morada' => $row['userAddress.address'] ?? '',
            'Número' => $row['userAddress.number'] ?? '',
            'Complemento' => $row['userAddress.complement'] ?? '',

            'Dados da vaga' => '', // vazio só pra separar no excel
            'Bolsa (R$)' => $row['job.scholarship_value'],
            'Valor nominal da bolsa' => $row['job.scholarship_nominal_value'],
            'Vale transporte' => $row['job.transport_voucher'],

            'Outro local de trabalho' => '', // vazio só pra separar no excel
            'Outro local: CEP' => $row['jobOtherAddress.cep'] ?? '',
            'Outro local: Estado' => $row['jobOtherAddress.uf'] ?? '',
            'Outro local: Cidade' => $row['jobOtherAddress.city'] ?? '',
            'Outro local: Bairro' => $row['jobOtherAddress.street'] ?? '',
            'Outro local: Endereço Completo' => $row['jobOtherAddress.address'] ?? '',
            'Outro local: Número' => $row['jobOtherAddress.number'] ?? '',
            'Outro local: Complemento' => $row['jobOtherAddress.complement'] ?? '',

            'Jornada' => '', // vazio só pra separar no excel
            'De' => $row['working_day.start_weekday'] ?? '',
            'A' => $row['working_day.end_weekday'] ?? '',
            'Das' => $row['working_day.start_hour'] ?? '',
            'As' => $row['working_day.end_hour'] ?? '',
            'Exceção' => '', // vazio só pra separar no excel
            'Exceção dia' => $row['working_day.day_off_start_weekday'] ?? '',
            'Exceção das' => $row['working_day.day_off_start_hour'] ?? '',
            'Exceção as' => $row['working_day.day_off_end_hour'] ?? '',
            'Folga' => $row['working_day.day_off'] ?? '',
            'Horas semanais' => $row['working_day.working_hours'] ?? '',

            'Dados do contrato' => '', // vazio só pra separar no excel
            'Status' => $row['status'],
            'Supervisor de Estágio' => $row['supervisor'] ?? '',
            'Início do Contrato' => $row['start_contract_vigence'] ?? '',
            'Fim do Contrato*' => $row['end_contract_vigence'] ?? '',
            'Cobrança Retroativa' => $row['retroative_billing'] ?? '',

            'Dados do seguro' => '', // vazio só pra separar no excel
            'Data do seguro' => $row['insurance_date'],

        ];
    }

    public function specialConditions(FiltersService $filtersService): void
    {
        $filtersService->addSpecialField('status', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->where('status', '=', '0'),
                1 => $builder->where('status', '=', '1')->where('end_contract_vigence', '>=', date('Y-m-d') . ' 00:00:00'),
                2 => $builder->where('status', '=', '1')
                    ->where('end_contract_vigence', '>=', date('Y-m-d') . ' 00:00:00')
                    ->where('end_contract_vigence', '<=', date('Y-m-d', strtotime('+30 days')) . ' 23:59:59'),
                3 => $builder->where('status', '=', '1')->where('end_contract_vigence', '<', date('Y-m-d')),
            };
        });

        $filtersService->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->whereHas('candidate', function (Builder $builder) {
                    $builder->whereRaw("MONTH(birth_day) = " . date("n"));
                }),
                1 => $builder->whereHas('candidate', function (Builder $builder) {
                    $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")));
                })
            };
        });
    }
}