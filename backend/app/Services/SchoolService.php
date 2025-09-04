<?php

namespace App\Services;

use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Helpers\Filter;
use App\Models\School;
use App\Models\SchoolMember;
use App\Services\Documents\WordProcessor;
use App\Traits\Common\Filterable;
use App\Traits\Common\IsAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SchoolService
{
    use Filterable;
    use IsAdmin;

    public function __construct(public WordProcessor $wordProcessor) {}

    public function index($criteria)
    {
        $this->addSpecialField('status', function (Builder $query, Filter $filter) {
            return $filter->getValue() === 1
                ? $query->withoutTrashed()
                : $query->onlyTrashed();
        });

        $shouldOrderByName = isset($criteria['perPage']) && $criteria['perPage'] == '9999';
        $data = $this->applyCriteria(School::withTrashed()->orderBy($shouldOrderByName ? 'corporate_name' : 'id', $shouldOrderByName ? 'asc' : 'desc'), $criteria);
        $data->with(['responsible', 'documents', 'courses', 'address']);
        $user = Auth::user();
        if (request()->has('city')) {
            $city = request()->query('city');
            $data->whereHas('address', function ($query) use ($city) {
                $query->where('district', $city);
            });
        }
        if (request()->has('district')) {
            $district = request()->query('district');
            $data->whereHas('address', function ($query) use ($district) {
                $query->where('uf', $district);
            });
        }
        if ($user === null) {
            return $data->paginate(Arr::get($criteria, 'perPage', 10));
        }
        $roleId = $user->roles[0]->id ?? null;
        if (request()->has('schoolId')) {
            $data->where('id', request()->query('schoolId'));
        }
        if ($this->isAdmin() === false && $roleId !== 14 && $roleId !== 13) {
            $schoolId = $user->school[0]->id ?? null;
            $data->where('id', $schoolId);
        }
        return $data->paginate(Arr::get($criteria, 'perPage', 10));
    }

    public function store($data)
    {
        $data['status'] = 1; // Define a escola como ativa

        return tap(School::create($data), function (School $school) use ($data) {
            $address = Arr::get($data, 'address');
            $responsible = Arr::get($data, 'responsible', []);
            $courses = Arr::get($data, 'courses', []);

            $school->contact()->create(Arr::get($data, 'contact', []));
            $school->address()->create($address);
            $school->responsible()->create($responsible);
            $school->courses()->sync($courses);

            /* $generatedDocument = $this->wordProcessor->make(DocumentTypeTemplateEnum::CONTRACT_SCHOOL, [
            'razaoSocial' => $school->corporate_name,
            'endereco' => $address['address'],
            'bairro' => $address['district'],
            'numero' => $address['number'],
            'cidade' => $address['city'],
            'uf' => strtoupper($address['uf']),
            'cep' => $address['cep'],
            'cnpj' => $school->cnpj,
            'responsavel' => $responsible['name'],
            'data' => now()->translatedFormat("d \\d\\e F \\d\\e Y"),
        ]);

            $school->documents()->create([
                'filename' => $generatedDocument['randomName'],
                'original_filename' => $generatedDocument['filename'],
                'file_extension' => 'docx',
                'filesize' => $generatedDocument['filesize'],
                'type' => 'Empresa Escola',
            ]); */

            return $school->load(['contact', 'address', 'responsible', 'documents', 'courses']);
        });
    }

    public function update(School $school, $data)
    {
        $user = Auth::user();
        if ($this->isAdmin() || $user->roles[0]->id === 10) {
            $school->update($data);
            $school->contact()->update(Arr::get($data, 'contact', []));
            $school->address()->updateOrCreate([], Arr::get($data, 'address', []));
            $school->responsible()->update(Arr::get($data, 'responsible', []));
            $school->courses()->sync(Arr::get($data, 'courses', []));
            return;
        }
        throw new HttpException(403, 'Sem permissão para editar essa escola');
    }
}
