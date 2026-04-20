<?php

namespace App\Services;

use App\Enums\Company\TypeEnum;
use App\Enums\RolesEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Helpers\Filter;
use App\Models\Company\Company;
use App\Models\Company\CompanyBranch;
use App\Models\Users\User;
use App\Models\SchoolMember;
use App\Services\Documents\WordProcessor;
use App\Services\Users\UsersServices;
use App\Traits\Common\Filterable;
use App\Traits\Common\IsAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CompaniesService
{
    use Filterable;
    use IsAdmin;

    public function __construct(
        private WordProcessor $wordProcessor,
        private UsersServices $usersServices
    ) {}

    public function index($criteria)
    {

        $this->addSpecialField('status', function (Builder $query, Filter $filter) {
            return $filter->getValue() === 1
                ? $query->withoutTrashed()
                : $query->onlyTrashed();
        });

        $this->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            $builder->whereHas('responsible', function (Builder $builder) use ($filter) {
                match ($filter->getValue()) {
                    0 => $builder->whereRaw("MONTH(birth_day) = " . date("n")),
                    1 => $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")))
                };
            });
        });

        $shouldOrderByName = isset($criteria['perPage']) && $criteria['perPage'] == '9999';
        $builder = Company::query()->orderBy($shouldOrderByName ? 'corporate_name' : 'id', $shouldOrderByName ? 'asc' : 'desc');

        if (!isset($criteria['withoutTrashed'])) {
            $builder->withTrashed();
        }

        if (isset($criteria['user_id'])) {
            $builder->where('user_id', $criteria['user_id']);
        }
        $data = $this->applyCriteria($builder, $criteria)->with(['responsible']);
        if (!$this->isAdmin()) {
            $user = Auth::user();
            $data->where('user_id', $user->id);
        }
        return $data->paginate(Arr::get($criteria, 'perPage', 10));
    }

    public function store($data)
    {
        return DB::transaction(fn() => tap(Company::create($data), function (Company $company) use ($data) {
            $address = Arr::get($data, 'address');
            $contact = Arr::get($data, 'contact');
            $responsible = Arr::get($data, 'responsible');
            $billing = Arr::get($data, 'billing');

            $company->billing()->create($billing);
            $company->contact()->create($contact);
            $company->address()->create($address);
            $company->responsible()->create($responsible);

            $data = [
                'razaoSocial' => $company->corporate_name,
                'razaoSocialCompany' => $company->corporate_name,
                'nomeFantasia' => $company->fantasy_name,
                'endereco' => $address['address'],
                'numero' => $address['number'],
                'bairro' => $address['district'],
                'cidade' => $address['city'],
                'estado' => strtoupper(getCityByUf($address['uf'])),
                'uf' => $address['uf'],
                'cep' => $address['cep'],
                'dataIGPM' => date("d/m/Y"),

                'cnpj' => $company->cnpj,
                'telefone' => $responsible['phone'],
                'ramoAtividade' => $company->branch_of_activity,
                'responsavel' => $responsible['name'],
                'cargoResponsavel' => $responsible['role'] ?? '',
                'rgResponsavel' => $responsible['document'] ?? '',
                'mensalidade' => format_percent($billing['monthly_payment']),
                'colocacao' => format_percent($billing['colocacao']),

                'data' => now()->translatedFormat("d \\d\\e F \\d\\e Y"),
                'dataAtual' => date("d/m/Y"),

                ...($company->type === TypeEnum::PJ ? [
                    'ie' => $company->municipal_registration
                ] : [
                    'ie' => $company->oab ? sprintf('INSCRITA NA OAB/SP SOB N°: %s E CRCSP N° %s', $company->oab, $company->crcsp) : ''
                ])
            ];

            /* $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::CONTRACT_COMPANY, $data);

            $company->documents()->create([
                'filename' => $generatedDocument['randomName'],
                'original_filename' => $generatedDocument['filename'],
                'file_extension' => 'docx',
                'filesize' => $generatedDocument['filesize'],
                'type' => 'Empresa Empresa',
            ]); */
        }));
    }

    public function update(Company $company, $data)
    {
        return DB::transaction(function () use ($company, $data) {
            $user = Auth::user();
            if ($this->isAdmin() || $company->user_id === $user->id) {
                $company->update($data);
                $billing = Arr::get($data, 'billing', []);
                $contact = Arr::get($data, 'contact', []);
                $address = Arr::get($data, 'address', []);
                $responsible = Arr::get($data, 'responsible', []);
                $company->billing()->updateOrCreate(['company_id' => $company->id], $billing);
                $company->contact()->updateOrCreate(['contactable_id' => $company->id], $contact);
                $company->address()->updateOrCreate(['addressable_id' => $company->id], $address);
                $company->responsible()->updateOrCreate(['responsible_id' => $company->id], $responsible);
            }
        });
    }

    public function storeCompanyBranchUser(User $companyUser, array $data): CompanyBranch
    {
        if (!isset($companyUser->company)) {
            throw new HttpException(403, 'Deve ser uma empresa para criar uma unidade');
        }

        return DB::transaction(function () use ($companyUser, $data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'start_hour' => '00:00:00',
                'end_hour' => '23:59:00',
                'role_id' => RolesEnum::COMPANY_BRANCH->value,
            ]);
            $user->roles()->attach(RolesEnum::COMPANY_BRANCH->value);

            $companyBranch = CompanyBranch::create([
                'company_id' => $companyUser->company->id,
                'user_id' => $user->id,
                'name' => $data['name'],
                'email' => $data['email']
            ]);
            $user->setRelation('companyBranch', $companyBranch);
            return $companyBranch;
        });
    }

    public function updateCompanyBranchUser(User $companyUser, CompanyBranch $companyBranch, array $data): CompanyBranch
    {
        $this->guardCompanyBranchOwnership($companyUser, $companyBranch);

        return DB::transaction(function () use ($companyBranch, $data) {
            $userData = Arr::only($data, ['name', 'email']);

            if (Arr::has($data, 'password') && filled($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            if ($userData !== []) {
                $companyBranch->user()->update($userData);
            }

            $branchData = Arr::only($data, ['name', 'email']);

            if ($branchData !== []) {
                $companyBranch->update($branchData);
            }

            return $companyBranch->fresh(['user']);
        });
    }

    public function destroyCompanyBranchUser(User $companyUser, CompanyBranch $companyBranch): void
    {
        $this->guardCompanyBranchOwnership($companyUser, $companyBranch);

        DB::transaction(function () use ($companyBranch) {
            $companyBranch->user()->delete();
            $companyBranch->delete();
        });
    }

    private function guardCompanyBranchOwnership(User $companyUser, CompanyBranch $companyBranch): void
    {
        $companyId = $companyUser->company?->id;

        if (!$companyId) {
            throw new HttpException(403, 'Deve ser uma empresa para gerir unidades');
        }

        if ((int) $companyBranch->company_id !== (int) $companyId) {
            throw new ModelNotFoundException('Unidade não encontrada para esta empresa');
        }
    }
}
