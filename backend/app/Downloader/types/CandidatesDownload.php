<?php

namespace App\Downloader\types;

use App\Downloader\IDownloaderDefinition;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Enums\GenderEnum;
use App\Enums\InterestEnum;
use App\Enums\PeriodEnum;
use App\Helpers\Filter;
use App\Models\Candidate;
use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;

class CandidatesDownload extends BaseTypeDownload implements IDownloaderDefinition
{

    public function model(): string
    {
        return Candidate::class;
    }

    public function relations(): array
    {
        return ['address', 'school', 'userCourse'];
    }

    public function internalization(): string
    {
        return 'Candidatos';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Nome do candidato' => $row['name'],
            'Data de nascimento' => $row['birth_day'],
            'CPF' => $row['cpf'],
            'RG' => $row['rg'],
            'Género' => GenderEnum::getLabel(GenderEnum::tryFrom($row['gender'])),
            'Tipo de ensino' => StudyingLevelEnum::getLabel(StudyingLevelEnum::tryFrom($row['studying_level'])),
            'Curso' => $row['course'],
            'Semestre' => $row['semester'],
            'RA' => $row['ra'],
            'Período' => PeriodEnum::getLabel(PeriodEnum::tryFrom($row['period'])),
            'Escola' => $row['school.corporate_name'],
            'Interesse' => InterestEnum::getLabel(InterestEnum::tryFrom($row['interest'])),

            'Morada' => '', // vazio só pra separar no excel
            'CEP' => $row['address.cep'] ?? '',
            'Estado' => $row['address.uf'] ?? '',
            'Cidade' => $row['address.city'] ?? '',
            'Bairro' => $row['address.street'] ?? '',
            'Endereço Completo' => $row['address.address'] ?? '',
            'Número' => $row['address.number'] ?? '',
            'Complemento' => $row['address.complement'] ?? '',

            'Outras informações' => '', // vazio só pra separar no excel
            'Piercing' => $row['piercing'] ?? '',
            'Tatuagem' => $row['tattoo'] ?? '',
            'Fumante' => $row['smoker'] ?? '',
            'Filhos' => $row['marital_status'] ?? '',
            'Estado Cívil' => $row['sons'] ?? '',
            'Qual/Onde?' => $row['how_find_us_name'] ?? '',
            'Palavras chaves' => $row['tags'] ?? '',
            'Observações do candidato' => $row['candidate_observations'] ?? '',
        ];
    }

    public function specialConditions(FiltersService $filtersService): void
    {
        $filtersService->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->whereRaw("MONTH(birth_day) = " . date("n")),
                1 => $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")))
            };
        });
    }
}