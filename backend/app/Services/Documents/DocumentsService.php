<?php

namespace App\Services\Documents;

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

        $this->addSpecialField('created_at', function (Builder $builder, Filter $filter) {
            return $builder->whereBetween('created_at', [$filter->getValue()[0] . ' 00:00:00', $filter->getValue()[1] . ' 23:59:59']);
        });

        $data = $this->applyCriteria(Document::query()->with([
            'attachable' => function (MorphTo $morphTo) {
                $morphTo->morphWith([
                    Job::class => ['company'],
                    Company::class => [],
                    School::class => [],
                    Candidate::class => [],
                    Contract::class => [],
                ]);
            }
        ]), $criteria);

        if (!$isAdmin && in_array($roleId, [13, 10, 14])) {
            $data->orWhereHasMorph('attachable', Contract::class, function (Builder $query) use ($user) {
                $query->where('candidate_id', $user->candidate->id ?? 0)
                      ->orWhere('company_id', $user->company->id ?? 0);
                      /* ->orWhere('school_id', $user->school[0]->id ?? 0); */
            });
        }

        if (!$isAdmin && $roleId === 13) {
            $data->orWhereHasMorph('attachable', Candidate::class, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }

        if (!$isAdmin && $roleId === 10) {
            $data->orWhereHasMorph('attachable', School::class, function (Builder $query) use ($user) {
                $query->where('id', $user->id);
            });
        }

        if (!$isAdmin && $roleId === 14) {
            $data->orWhereHasMorph('attachable', Company::class, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }

        return $data->orderByDesc('id')->paginate(Arr::get($criteria, 'perPage', 10));
    }
}
