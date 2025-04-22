<?php

namespace App\Services;

use App\Enums\ActiveEnum;
use App\Enums\CandidateStatusEnum;
use App\Enums\DisapprovedEnum;
use App\Helpers\Filter;
use App\Models\Candidate;
use App\Models\SchoolMember;
use App\Models\Users\User;
use App\Traits\Common\Filterable;
use App\Traits\Common\IsAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log;

class CandidatesService
{
    use Filterable;
    use IsAdmin;

    public function index($criteria)
    {
        $this->addSpecialField('birth_day', function (Builder $builder, Filter $filter) {
            match ($filter->getValue()) {
                0 => $builder->whereRaw("MONTH(birth_day) = " . date("n")),
                1 => $builder->whereRaw("MONTH(birth_day) = " . date("n", strtotime("+1 month")))
            };
        });

        $shouldOrderByName = isset($criteria['perPage']) && $criteria['perPage'] == '99999';
        $candidateBuilder = $this->getBuilder(
            Candidate::query()->orderBy('name', 'asc'),
            $criteria
        );

        if (isset($criteria['user_id'])) {
            $candidateBuilder->where('user_id', $criteria['user_id']);
        }
        $user = Auth::user();

        $data = $this->applyCriteria($candidateBuilder, $criteria)->select(['*', 'name as nameOriginal']);
        $data->with(['address', 'user', 'contact', 'user.school']);
        if ($user->roles[0]->id === 10) {
            $data->whereHas('user.school', function ($q) use ($user) {
                $q->where('school_members.school_id', $user->school[0]->id);
            })->get();
        }
        if ($user->roles[0]->id === 13) {
            $data->where('user_id', $user->id);
        }
        return $data->paginate(Arr::get($criteria, 'perPage', 10));
    }

    private function getBuilder(Builder $builder, array $criteria): Builder
    {
        $status = Arr::get($criteria, 'status');
        $job = Arr::get($criteria, 'job');
        $type = Arr::get($criteria, 'type');

        // listagem para poder chamar candidatos que não estão com contrato ativo e nem em testes
        if ($type) {
            return $builder
                ->whereDoesntHave('contracts', fn (Builder $builder) => $builder
                    ->where('status', '=', ActiveEnum::ACTIVE))
                ->whereDoesntHave(
                    'jobs',
                    fn (Builder $builder) => $builder
                    ->where('status', '=', CandidateStatusEnum::IN_TESTS)
                );
        }

        if (!$status || !$job) {
            return $builder;
        }

        // listagem de cada workflow da vaga, impedindo que quem esteja com contrato ativo/em testes possa passar
        // para outra fase que não do job atual
        return $builder
            ->whereDoesntHave('contracts', fn (Builder $builder) => $builder
                ->where('status', '=', ActiveEnum::ACTIVE))
            ->whereHas(
                'jobs',
                fn (Builder $builder) => $builder
                ->whereRaw('`jobs`.`id` = ?', [$job])
                ->where('disapproved', '=', DisapprovedEnum::NOT_DISAPPROVED)
                ->where('status', '=', $status)
            )->whereDoesntHave(
                'jobs',
                fn (Builder $builder) => $builder
                ->where('status', '=', CandidateStatusEnum::IN_TESTS)
                ->whereRaw('`jobs`.`id` != ?', [$job])
                ->where('disapproved', '=', DisapprovedEnum::NOT_DISAPPROVED)
            );
    }

    public function store($data)
    {
        if (!isset($data['user_id'])) {
            $data['user_id'] = 3;
        }
        return tap(Candidate::create($data), function (Candidate $candidate) use ($data) {
            if (isset($data['school_id'])) {
                if (isset($data['school_id']) && User::find($candidate->user_id)) {
                    SchoolMember::create([
                        'user_id' => $candidate->user_id,
                        'school_id' => $data['school_id']
                    ]);
                }                
            }
            $candidate->address()->create(Arr::get($data, 'address'));
            $candidate->contact()->create(Arr::get($data, 'contact'));
        });
    }

    public function update(Candidate $candidate, $data)
    {
        $user = Auth::user();
    
        if ($this->isAdmin() || $candidate->user_id === $user->id) {
            if (!empty($data['resume'])) {
                $resumeData = base64_decode($data['resume']);
                $fileName = 'resume_' . time() . '.pdf';
                Storage::disk('public')->put('resumes/' . $fileName, $resumeData);
                $data['resume'] = 'resumes/' . $fileName;
            }
    
            $candidate->update($data);
    
            if (isset($data['school_id'])) {
                SchoolMember::updateOrCreate(
                    ['user_id' => $candidate->user_id],
                    ['user_id' => $candidate->user_id, 'school_id' => $data['school_id']]
                );
            }
    
            $candidate->address()->updateOrCreate(['addressable_id' => $candidate->id], Arr::get($data, 'address', []));
            $candidate->contact()->updateOrCreate(['contactable_id' => $candidate->id], Arr::get($data, 'contact', []));
    
            return;
        }
    
        throw new HttpException(403, 'Sem permissão para editar esse candidato');
    }    
}
