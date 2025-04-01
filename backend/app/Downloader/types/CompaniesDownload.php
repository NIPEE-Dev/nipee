<?php

namespace App\Downloader\types;

use App\Downloader\IDownloaderDefinition;
use App\Helpers\Filter;
use App\Models\Company\Company;
use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;

class CompaniesDownload extends BaseTypeDownload implements IDownloaderDefinition
{
    public function model(): string
    {
        return Company::class;
    }

    public function relations(): array
    {
        return ['billing.seller', 'responsible', 'contact', 'address'];
    }

    public function internalization(): string
    {
        return 'Empresas';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Nome fantasia' => $row['fantasy_name'],
            'Razão social' => $row['corporate_name'],
            'Tipo de empresa' => $row['type'],
            'CNPJ' => $row['cnpj'],
            'CPF' => $row['cpf'],
            'OAB' => $row['oab'],
            'CRCSP' => $row['crcsp'],
            'Registro municipal' => $row['municipal_registration'],
            'Ramo de atividade' => $row['branch_of_activity'],
            'Supervisor' => $row['supervisor'],
            'Observações' => $row['observations'],
            'Inicio de vigencia' => $row['start_contract_vigence'],

            'Endereço' => '', // vazio só pra separar no excel
            'CEP' => $row['address.cep'] ?? '',
            'Estado' => $row['address.uf'] ?? '',
            'Cidade' => $row['address.city'] ?? '',
            'Bairro' => $row['address.street'] ?? '',
            'Endereço Completo' => $row['address.address'] ?? '',
            'Número' => $row['address.number'] ?? '',
            'Complemento' => $row['address.complement'] ?? '',

            'Cobrança' => '', // vazio só pra separar no excel
            'Vendedor' => $row['billing.seller.name'] ?? '',
            'Adesão' => $row['billing.colocacao'] ?? '',
            'Mensalidade' => $row['billing.monthly_payment'] ?? '',
            'Email Cobrança' => $row['billing.email'] ?? '',
            'Vencimento' => $row['billing.due_date'] ?? '',
            'Dia útil' => $row['billing.business_day'] ?? '',
            'Emite NF' => $row['billing.issue_invoice'] ?? '',
            'Emite Boleto' => $row['billing.issue_bank_slip'] ?? '',

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

        $filtersService->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            $builder->whereHas('responsible', function (Builder $builder) use ($filter) {
                match ($filter->getValue()) {
                    0 => $builder->whereRaw("MONTH(birth_day) = " . date("n")),
                    1 => $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")))
                };
            });
        });
    }
}