<?php

namespace App\Services\Activities;

use App\Enums\ActiveEnum;
use App\Enums\Activities\ActivityStatusEnum;
use App\Mail\FctReportMail;
use App\Models\Activities\Activity;
use App\Models\FctReport;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
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
        try {
            DB::beginTransaction();

            $activity = Activity::query()->where('id', $id)->first();
            if (!isset($activity)) {
                throw new HttpException(400, 'Atividade não encontrada');
            }
            $activity->update($data);

            $availableTotalHours = $activity->user->candidate->hours_fct ?? 0;
            $currentTotalHours = $activity->user->activities->where('status', '!=', ActivityStatusEnum::PENDING->value)->sum('estimated_time');
            if ($availableTotalHours !== 0 && $currentTotalHours >= $availableTotalHours) {
                $contract = $activity->user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first();
                $school = $contract->school;
                $company = $contract->company;
                $activities = $activity->user->activities->map(function ($item, $key) {
                    return [
                        'date' => $item->created_at->format('d/m/Y'),
                        'hours' => $item->estimated_time,
                        'justification' => $item->justification ?? '',
                    ];
                });

                $data = [
                    'schoolName' => $school->corporate_name ?? '',
                    'designation' => 'Designação',
                    'companyName' => $company->corporate_name ?? '',
                    'companyPhone' => $company->contact->phone ?? '',
                    'studentName' => $activity->user->candidate->name ?? '',
                    'studentPhone' => $activity->user->candidate->contact->phone ?? '',
                    'jobName' => $contract->job->role ?? '',
                    'hoursDuration' => "$availableTotalHours",
                    'monthsDuration' => "" . $contract->start_contract_vigence->diffInMonths($contract->end_contract_vigence),
                    'activitiesBlock' => $activities->all(),
                ];

                $docPath = $this->generateReportDoc($data);

                FctReport::create([
                    'candidate_name' => $data['studentName'],
                    'company_name' => $data['companyName'],
                    'total_hours' => $data['hoursDuration'],
                    'report' => '/docs/' . $docPath['name'],
                    'candidate_id' => $activity->user->candidate->id,
                    'school_id' => $school->id,
                    'company_id' => $company->id,
                    'sent_date' => Carbon::now(),
                ]);

                foreach ([$school->contact->email, $company->contact->email] as $recipient) {
                    Mail::to($recipient)->send(new FctReportMail($docPath['path']));
                }
            }
            DB::commit();

            return $activity;
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
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

    public function generateReportDoc($data)
    {
        $template = new TemplateProcessor(storage_path('app/base_documents/guarulhos/relatorioFct.docx'));
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $template->setValue($key, $value);
                continue;
            }
            if (is_array($value)) {
                $template->cloneRowAndSetValues('date', $value);
                continue;
            }
        }
        $name = Str::uuid() . '.docx';
        $path = storage_path('app/public/docs/' . $name);
        $template->saveAs($path);

        return ['path' => $path, 'name' => $name];
    }
}
