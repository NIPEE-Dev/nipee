<?php

namespace App\Services;

use App\Enums\TableDownloadTypeEnum;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Contracts\Contract;
use App\Models\Document;
use App\Models\Jobs\Job;
use App\Models\School;

abstract class DownloaderService
{
    protected function get(TableDownloadTypeEnum $resource, ?int $id = null)
    {
        $modelSettings = $this->retrieveModelSettings($resource->value);
        $instance = $this->getModelInstance($modelSettings['model'], $id);
        $instance->load($modelSettings['relations']);
        return $instance;
    }

    protected function retrieveModelSettings(string $model): array
    {
        return match ($model) {
            'Companies' => [
                'model' => Company::class,
                'relations' => ['billing', 'responsible', 'contact', 'address']
            ],
            'Contracts' => [
                'model' => Contract::class,
                'relations' => ['company', 'school', 'candidate', 'job', 'workingDay', 'reasonForTermination']
            ],
            'Schools' => [
                'model' => School::class,
                'relations' => ['responsible', 'contact', 'address']
            ],
            'Candidates' => [
                'model' => Candidate::class,
                'relations' => ['address', 'school', 'userCourse']
            ],
            'Jobs' => [
                'model' => Job::class,
                'relations' => ['workingDay', 'company', 'role']
            ],
            'Documents' => [
                'model' => Document::class,
                'relations' => []
            ],
        };
    }

    protected function getModelInstance($model, ?int $id)
    {
        if ($id) {
            return resolve($model)->findOrFail($id);
        }

        return resolve($model)->all();
    }
}