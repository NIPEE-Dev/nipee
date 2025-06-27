<?php

namespace App\Services;

use App\Models\Candidate;
use App\Models\Contracts\Contract;
use App\Models\Jobs\Job;
use App\Models\Jobs\JobCandidate;
use App\Models\Users\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ReportsService
{
    public function generateSystemActivityReport()
    {
        $users = User::count();
        $jobs = Job::count();
        $contracts = Contract::where('school_signature', true)->where('company_signature', true)->count();
        $jobCandidates = JobCandidate::count();

        return ['users' => $users, 'jobs' => $jobs, 'contracts' => $contracts, 'jobCandidates' => $jobCandidates];
    }

    public function generateCandidatesReport()
    {
        $request = request();
        $data = Candidate::with(['userCourse', 'user.school', 'jobs', 'jobs.company', 'jobs.documents', 'contracts', 'contracts.documents'])->has('contracts', '>=', 1)->has('contracts.documents', '>=', 1);
        $user = Auth::user();
        $hasFilter = $request->has('filterFields');
        $filterArray = $request->input('filterFields');
        $filters = [];
        if ($hasFilter && json_validate($filterArray)) {
            $filterData = json_decode($filterArray, true);
            if (is_array($filterData)) {
                for ($index = 0; $index < count($filterData); $index += 1) {
                    $current = $filterData[$index];
                    if (isset($current['value']) && isset($current['field'])) {
                        $filters[$current['field']] = $current['value'];
                    }
                }
            }
        }

        $roleId = $user->roles[0]->id;
        if ($roleId === 14) {
            $data->whereHas('contracts', function ($query) use ($user) {
                $query->where('company_id', $user->company->id ?? 0);
            });
        }
        if ($roleId === 10) {
            $data->whereHas('contracts', function ($query) use ($user) {
                $query->where('school_id', $user->school[0]->id ?? 0);
            });
        }

        if ($hasFilter && isset($filters['name'])) {
            $data->where('name', 'LIKE', $filters['name'] . '%');
        }
        if ($hasFilter && isset($filters['courseTitle'])) {
            $data->whereHas('userCourse', function ($query) use ($filters) {
                $query->where('title', 'LIKE', $filters['courseTitle'] . '%');
            });
        }
        if ($hasFilter && isset($filters['startContractDate'])) {
            $data->whereHas('contracts', function ($query) use ($filters) {
                $query->whereBetween('start_contract_vigence', $filters['startContractDate']);
            });
        }
        if ($hasFilter && isset($filters['endContractDate'])) {
            $data->whereHas('contracts', function ($query) use ($filters) {
                $query->whereBetween('end_contract_vigence', $filters['startContractDate']);
            });
        }
        if ($hasFilter && isset($filters['status'])) {
            $data->whereHas('contracts', function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            });
        }

        return $data->paginate(10);
    }
}
