<?php

namespace App\Services\Activities;

use App\Enums\Activities\ActivityStatusEnum;
use App\Models\Activities\Activity;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ActivitiesService
{
    public function create($data)
    {
        $activity = Activity::query()->create($data);

        return $activity;
    }

    public function update($data, $id)
    {
        $activity = Activity::query()->where('id', $id)->first();
        if (!isset($activity)) {
            throw new HttpException(400, 'Atividade não encontrada');
        }
        $activity->update($data);

        return $activity;
    }

    public function getById($id)
    {
        $activity = Activity::query()->where('id', $id)->first();

        return $activity;
    }

    public function getByUserId($userId)
    {
        $activities = Activity::query()->where('user_id', $userId)->get();

        return $activities;
    }

    public function getByCompanyId($companyId)
    {
        $activities = Activity::query()->where('status', '!=', ActivityStatusEnum::DRAFT->value)->whereHas('user.candidate.contracts', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->get();

        return $activities;
    }

    public function getBySchoolId($schoolId)
    {
        $activities = Activity::query()->where('status', '!=', ActivityStatusEnum::DRAFT->value)->whereHas('user.candidate.contracts', function ($query) use ($schoolId) {
            $query->where('school_id', $schoolId);
        })->get();

        return $activities;
    }
}
