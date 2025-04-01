<?php

namespace App\Downloader\types;

use App\Downloader\DownloadReplaceHelper;
use App\Downloader\IDownladableContent;
use App\Downloader\IDownloaderDefinition;
use App\Enums\GenderEnum;
use App\Enums\PeriodEnum;
use App\Models\Jobs\Job;
use Exception;
use Illuminate\Support\Collection;

class JobsDownload extends BaseTypeDownload implements IDownloaderDefinition
{

    public function definition(IDownladableContent $content)
    {
        return Collection::make($content->getRow())->map(function ($value, $key) {
            DownloadReplaceHelper::exact($key, 'period', $value, fn() => PeriodEnum::getLabel(PeriodEnum::from($value)));
            DownloadReplaceHelper::from($key, 'gender', $value, fn() => GenderEnum::getLabel(GenderEnum::from($value)));
            DownloadReplaceHelper::exact($key, 'type', $value, fn() => $value === 'ES' ? 'Estágio' : 'FCT');
            DownloadReplaceHelper::exact($key, 'transport_voucher', $value, fn() => $value == '1' ? 'Sim' : 'Não');
            return $value;
        })->toArray();
    }

    public function model(): string
    {
        return Job::class;
    }

    public function relations(): array
    {
        return ['workingDay', 'company', 'role'];
    }

    public function internalization(): string
    {
        return 'Vagas';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Periodo' => $row['period'],
            'Genero' => $row['gender'],
            'Vale transporte' => $row['transport_voucher'],
            'Valor do vale transporte' => $row['transport_voucher_value'],
            'Valor nominal do vale transporte' => $row['transport_voucher_nominal_value'],
            'Bolsa (R$)' => $row['scholarship_value'],
            'Valor nominal da bolsa' => $row['scholarship_nominal_value'],
            'Vagas disponíveis' => $row['available'],
            'Tipo' => $row['type'],
            'Mostrar na WEB' => $row['show_web'],
            'Criado em' => $row['created_at'],
            'Atualizado Em' => $row['updated_at'],
            'Deletado Em' => $row['deleted_at'],

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

            'Empresa' => '', // vazio só pra separar no excel
            'Nome fantasia' => $row['company.fantasy_name'] ?? '',
            'Razão social' => $row['company.corporate_name'] ?? '',
            'Tipo de empresa' => $row['company.type'] ?? '',
            'CNPJ' => $row['company.cnpj'] ?? '',
            'CPF' => $row['company.cpf'] ?? '',
            'OAB' => $row['company.oab'] ?? '',
            'CRCSP' => $row['company.crcsp'] ?? '',
            'Registro municipal' => $row['company.municipal_registration'] ?? '',
            'Ramo de atividade' => $row['company.branch_of_activity'] ?? '',
            'Supervisor' => $row['company.supervisor'] ?? '',
            'Observações' => $row['company.observartions'] ?? '',
            'Inicio de vigencia' => $row['company.start_contract_vigence'] ?? '',

            'Vaga' => '', // vazio só pra separar no excel
            'Titulo' => $row['role.title'] ?? '',
        ];
    }
}