<?php

namespace App\Services\Activities;

use App\Enums\ActiveEnum;
use App\Enums\Activities\ActivityStatusEnum;
use App\Enums\FctEvaluationStatusEnum;
use App\Enums\UserCandidateStatusEnum;
use App\Mail\CompletedFctHoursMail;
use App\Mail\FctReportMail;
use App\Models\Activities\Activity;
use App\Models\FctEvaluation;
use App\Models\FctReport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ActivitiesService
{
    public function create($data)
    {
        if (isset($data['absence_file'])) {
            $file = $data['absence_file'];
            $filename = $file->getClientOriginalName();

            Storage::disk('public')->put('/absences/' . $filename, file_get_contents($file));
            $data['absence_file'] = "/storage/absences/" . $filename;
        }
        $activity = Activity::query()->create($data);

        return $activity;
    }

    public function update($data, $id)
    {
        try {
            DB::beginTransaction();

            $activity = Cache::lock('update-activity', 20)
                ->block(60, function () use ($id, $data) {
                    $activity = Activity::query()->where('id', $id)->first();
                    if (!isset($activity)) {
                        throw new HttpException(400, 'Atividade não encontrada');
                    }
                    $updateData = [...$data];
                    if (isset($data['absence_file'])) {
                        $file = $data['absence_file'];
                        $filename = $file->getClientOriginalName();

                        Storage::disk('public')->put('/absences/' . $filename, file_get_contents($file));
                        $data['absence_file'] = "/storage/absences/" . $filename;
                    }
                    $activity->update($updateData);
                    $activity->user->candidate->hours_completed += $activity->estimated_time;
                    $activity->user->candidate->hours_remaining = ($activity->user->candidate->hours_fct ?? 0) - $activity->user->candidate->hours_completed;
                    if ($activity->user->candidate->hours_remaining <= 0) {
                        $activity->user->candidate->status = UserCandidateStatusEnum::CONCLUDED->value;
                    }
                    $activity->user->candidate->save();
                    $availableTotalHours = $activity->user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first()->originalJob?->fct_hours ?? 0;
                    $currentTotalHours = $activity->user->activities->where('status', '!=', ActivityStatusEnum::PENDING->value)->sum('estimated_time');
                    if ($availableTotalHours !== 0 && $currentTotalHours >= $availableTotalHours) {
                        $contract = $activity->user->candidate->contracts->where('status', ActiveEnum::ACTIVE)->first();
                        $school = $contract->school;
                        $company = $contract->company;
                        $activities = $activity->user->activities->map(function ($item, $key) {
                            return [
                                'date' => $item->created_at->format('d/m/Y'),
                                'hours' => $item->estimated_time,
                                'title' => $item->title,
                                'description' => $item->description,
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
                            'monthsDuration' => $contract->start_contract_vigence->format('d/m/Y') . ' - ' . $contract->end_contract_vigence->format('d/m/Y'),
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
                        FctEvaluation::create([
                            'status' => FctEvaluationStatusEnum::PENDING->value,
                            'candidate_id' => $activity->user->candidate->id,
                            'school_id' => $school->id,
                            'company_id' => $company->id,
                            'job_id' => $contract->originalJob->id,
                        ]);
                        try {
                            Mail::to($company->contact->email)->send(new CompletedFctHoursMail($company->supervisor, $school->corporate_name));
                            foreach ([$school->contact->email, $company->contact->email] as $recipient) {
                                Mail::to($recipient)->send(new FctReportMail($docPath['path']));
                            }
                        } catch (\Throwable $th) {
                        }
                    }

                    return $activity;
                });

            DB::commit();

            return $activity;
        } catch (\Throwable $th) {
            report($th);
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
        $activities = Activity::query()->where('user_id', $userId);

        // if (isset($filters['startDate'])) {
        //     $startDate = new Carbon($filters['startDate']);
        //     $activities->whereDate('activity_date', '>=', $startDate->startOfDay());
        // }

        // if (isset($filters['endDate'])) {
        //     $endDate = new Carbon($filters['endDate']);
        //     $activities->whereDate('activity_date', '<=', $endDate->endOfDay());
        // }

        // if (!isset($filters['startDate']) && !isset($filters['endDate'])) {
        //     $activities->whereMonth('activity_date', Carbon::now()->month);
        // }

        return $activities->get();
    }

    public function getByCompanyId($companyId, $filters)
    {
        $activities = Activity::query()->where('status', '!=', ActivityStatusEnum::DRAFT->value)->whereHas('user.candidate.contracts', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        });

        if (isset($filters['startDate'])) {
            $startDate = new Carbon($filters['startDate']);
            $activities->whereDate('activity_date', '>=', $startDate->startOfDay());
        }

        if (isset($filters['endDate'])) {
            $endDate = new Carbon($filters['endDate']);
            $activities->whereDate('activity_date', '<=', $endDate->endOfDay());
        }

        if (!isset($filters['startDate']) && !isset($filters['endDate'])) {
            $activities->whereMonth('activity_date', Carbon::now()->month);
        }

        return $activities->get();
    }

    public function getBySectorsIds($sectorIdsArr, $filters = [])
    {
        $activities = Activity::query()->where('status', '!=', ActivityStatusEnum::DRAFT->value)->whereHas('user.candidate.contracts', function ($query) use ($sectorIdsArr) {
            $query->whereIn('sector_id', $sectorIdsArr);
        })->orWhereHas('job', function ($q) use($sectorIdsArr) {
            $query->whereIn('sector_id', $sectorIdsArr);
        });

        if (isset($filters['startDate'])) {
            $startDate = new Carbon($filters['startDate']);
            $activities->whereDate('activity_date', '>=', $startDate->startOfDay());
        }

        if (isset($filters['endDate'])) {
            $endDate = new Carbon($filters['endDate']);
            $activities->whereDate('activity_date', '<=', $endDate->endOfDay());
        }

        if (!isset($filters['startDate']) && !isset($filters['endDate'])) {
            $activities->whereMonth('activity_date', Carbon::now()->month);
        }

        return $activities->get();
    }

    public function getBySchoolId($schoolId, $filters)
    {
        $activities = Activity::query()->where('status', '!=', ActivityStatusEnum::DRAFT->value)->whereHas('user.candidate.contracts', function ($query) use ($schoolId) {
            $query->where('school_id', $schoolId);
        });

        if (isset($filters['startDate'])) {
            $startDate = new Carbon($filters['startDate']);
            $activities->whereDate('activity_date', '>=', $startDate->startOfDay());
        }

        if (isset($filters['endDate'])) {
            $endDate = new Carbon($filters['endDate']);
            $activities->whereDate('activity_date', '<=', $endDate->endOfDay());
        }

        if (!isset($filters['startDate']) && !isset($filters['endDate'])) {
            $activities->whereMonth('activity_date', Carbon::now()->month);
        }

        return $activities->get();
    }

    public function getReportsBySchoolId($schoolId)
    {
        $reports = FctReport::query()->where('school_id', $schoolId)->get();

        return $reports;
    }

    public function getReportsByCompanyId($companyId)
    {
        $reports = FctReport::query()->where('company_id', $companyId)->get();

        return $reports;
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
        $formattedStudentName = $data['studentName'];

        if (isset($formattedStudentName) && $formattedStudentName !== '') {
            $formattedStudentName = str_replace(' ', '_', Str::lower($formattedStudentName)) . '_' . Str::random(5);
        } else {
            $formattedStudentName = Str::random(5);
        }

        $name = 'Report_' . $formattedStudentName . '.docx';
        $path = storage_path('app/public/docs/' . $name);
        $template->saveAs($path);

        return ['path' => $path, 'name' => $name];
    }
}
