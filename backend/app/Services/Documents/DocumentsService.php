<?php

namespace App\Services\Documents;

use App\Enums\ActiveEnum;
use App\Enums\RolesEnum;
use App\Helpers\Filter;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Contracts\Contract;
use App\Models\Document;
use App\Models\Jobs\Job;
use App\Models\School;
use App\Traits\Common\Filterable;
use App\Traits\Common\IsAdmin;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DocumentsService
{
    use Filterable;
    use IsAdmin;

    public function index($criteria): LengthAwarePaginator
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id;
        $isAdmin = $this->isAdmin();
        $nif = null;
        if (isset($criteria['filterFields'])) {
            $decodedFilters = json_decode($criteria['filterFields'], true);
            $withoutSkillsArr = [];
            foreach ($decodedFilters as $key => $value) {
                if ($value['field'] === 'nif') {
                    $nif = $value['value'];
                    continue;
                }
                $withoutSkillsArr[] = $value;
            }
            $criteria['filterFields'] = json_encode($withoutSkillsArr);
        }

        $this->addSpecialField('created_at', function (Builder $builder, Filter $filter) {
            return $builder->whereBetween('created_at', [$filter->getValue()[0] . ' 00:00:00', $filter->getValue()[1] . ' 23:59:59']);
        });

        $data = $this->applyCriteria(Document::query()->with([
            'attachable' => function (MorphTo $morphTo) {
                $morphTo->morphWith([
                    Job::class => ['company'],
                    Company::class => [],
                    School::class => [],
                    Candidate::class => ['contracts'],
                    Contract::class => [],
                ]);
            }
        ]), $criteria);


        if (isset($nif)) {
            $data->whereHasMorph('attachable', [Candidate::class], function ($q) use ($nif) {
                $q->where('cpf', $nif);
            });
        }
        if (!$isAdmin && in_array($roleId, [13, 10, 14]) && !isset($nif)) {
            $data->orWhereHasMorph('attachable', Contract::class, function (Builder $query) use ($user, $roleId) {
                if ($roleId === 13) {
                    $query->where('candidate_id', $user->candidate->id ?? 0);
                }
                if ($roleId === 14) {
                    $query->where('company_id', $user->company->id ?? 0);
                }
                if ($roleId === 10) {
                    $query->where('school_id', $user->school[0]->id ?? 0);
                }
            });
        }

        if (!$isAdmin && $roleId === 13 && !isset($nif)) {
            $data->orWhereHasMorph('attachable', Candidate::class, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }

        if (!$isAdmin && $roleId === 10 && !isset($nif)) {
            $data->orWhereHasMorph('attachable', School::class, function (Builder $query) use ($user) {
                $query->where('id', $user->id);
            });
        }

        if (!$isAdmin && $roleId === 14 && !isset($nif)) {
            $companyId = $user->company->id;
            $data->orWhereHasMorph('attachable', Candidate::class, function (Builder $q) use ($companyId) {
                $q->whereHas('contracts', function ($q)  use ($companyId) {
                    $q->where('status', '=', ActiveEnum::ACTIVE->value)->where('company_id', $companyId);
                });
            });
            $data->orWhereHasMorph('attachable', Company::class, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }
        if (!$isAdmin && $roleId === RolesEnum::COMPANY_BRANCH->value && !isset($nif)) {
            $branch = $user->companyBranch;
            $branchId = $branch?->id ?? 0;
            $sectorsIds = $branch?->sectors?->pluck('id') ?? collect();

            $data->where(function (Builder $query) use ($branchId, $sectorsIds) {
                $query->whereHasMorph('attachable', Candidate::class, function (Builder $q) use ($sectorsIds) {
                    $q->whereHas('contracts', function (Builder $q) use ($sectorsIds) {
                        $q->where('status', ActiveEnum::ACTIVE->value)
                            ->whereIn('sector_id', $sectorsIds);
                    });
                })
                    ->orWhereHasMorph('attachable', Contract::class, function (Builder $q) use ($sectorsIds) {
                        $q->whereIn('sector_id', $sectorsIds);
                    })
                    ->orWhereHasMorph('attachable', Job::class, function (Builder $q) use ($branchId, $sectorsIds) {
                        $q->where('branch_id', $branchId)
                            ->orWhereIn('sector_id', $sectorsIds);
                    });
            });
        }
        if (!$isAdmin && $roleId === RolesEnum::COMPANY_SECTOR->value && !isset($nif)) {
            $sectorId = $user->companySector?->id ?? 0;

            $data->where(function (Builder $query) use ($sectorId) {
                $query->whereHasMorph('attachable', Candidate::class, function (Builder $q) use ($sectorId) {
                    $q->whereHas('contracts', function (Builder $q) use ($sectorId) {
                        $q->where('status', ActiveEnum::ACTIVE->value)
                            ->where('sector_id', $sectorId);
                    });
                })
                    ->orWhereHasMorph('attachable', Contract::class, function (Builder $q) use ($sectorId) {
                        $q->where('sector_id', $sectorId);
                    })
                    ->orWhereHasMorph('attachable', Job::class, function (Builder $q) use ($sectorId) {
                        $q->where('sector_id', $sectorId);
                    });
            });
        }

        return $data->orderByDesc('id')->paginate(Arr::get($criteria, 'perPage', 10));
    }
}
