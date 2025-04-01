<?php

namespace App\Downloader\types;

use App\Downloader\IDownloaderDefinition;
use App\Helpers\Filter;
use App\Models\School;
use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;

class SchoolsDownload extends BaseTypeDownload implements IDownloaderDefinition
{
    public function model(): string
    {
        return School::class;
    }

    public function relations(): array
    {
        return ['responsible', 'contact', 'address'];
    }

    public function internalization(): string
    {
        return 'Escolas';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Nome fantasia' => $row['fantasy_name'],
            'Razão social' => $row['corporate_name'],
            'CNPJ' => $row['cnpj'],

            'Endereço' => '', // vazio só pra separar no excel
            'CEP' => $row['address.cep'] ?? '',
            'Estado' => $row['address.uf'] ?? '',
            'Cidade' => $row['address.city'] ?? '',
            'Bairro' => $row['address.street'] ?? '',
            'Endereço Completo' => $row['address.address'] ?? '',
            'Número' => $row['address.number'] ?? '',
            'Complemento' => $row['address.complement'] ?? '',

            'Responsável' => '', // vazio só pra separar no excel
            'Nome Responsável' => $row['responsible.name'] ?? '',
            'Telefone Responsável' => $row['responsible.phone'] ?? '',
            'Email Responsável' => $row['responsible.email'] ?? '',
            'Cargo Responsável' => $row['responsible.role'] ?? '',
            'RG' => $row['responsible.document'] ?? '',
            'Data de nascimento' => $row['responsible.birth_day'] ?? '',

            'Contato' => '', // vazio só pra separar no excel
            'Nome' => $row['contact.name'] ?? '',
            'Telefone' => $row['contact.phone'] ?? '',
            'Email' => $row['contact.email'] ?? '',
            'Cargo' => $row['contact.role'] ?? '',
        ];
    }



    public function specialConditions(FiltersService $filtersService): void
    {
        $filtersService->addSpecialField('status', function (Builder $query, Filter $filter) {
            return $filter->getValue() === 1
                ? $query->withoutTrashed()
                : $query->onlyTrashed();
        });
    }
}