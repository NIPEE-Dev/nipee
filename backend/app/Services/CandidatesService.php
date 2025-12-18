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
use App\Enums\BaseRecordsEnum;
use App\Enums\JobCandidateStatusEnum;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\PhpWord;
use Rap2hpoutre\FastExcel\FastExcel;
use ZipArchive;

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

        $this->addSpecialField('course', function (Builder $builder, Filter $filter) {
            $val = $filter->getValue();

            $builder->whereHas('userCourse', function (Builder $q) use ($val) {
                $q->where('type', BaseRecordsEnum::COURSES->value)
                    ->where('title', 'LIKE', "%{$val}%");
            });
        });

        $shouldOrderByName = isset($criteria['perPage']) && $criteria['perPage'] == '99999';
        $candidateBuilder = $this->getBuilder(
            Candidate::query()->orderBy('name', 'asc'),
            $criteria
        );
        $skills = [];
        $schoolId = null;
        if (isset($criteria['filterFields'])) {
            $decodedFilters = json_decode($criteria['filterFields'], true);
            $withoutSkillsArr = [];
            foreach ($decodedFilters as $key => $value) {
                if ($value['field'] === 'skills') {
                    $skills[] = $value['value'];
                    continue;
                }
                if ($value['field'] === 'school_id') {
                    $schoolId = $value['value'];
                    continue;
                }
                $withoutSkillsArr[] = $value;
            }
            $criteria['filterFields'] = json_encode($withoutSkillsArr);
        }

        if (count($skills) > 0) {
            foreach ($skills as $value) {
                $candidateBuilder->where('candidate_observations', 'LIKE', '%' . $value . '%');
            }
        }
        if (isset($criteria['user_id'])) {
            $candidateBuilder->where('user_id', $criteria['user_id']);
        }
        if (isset($criteria['id'])) {
            $candidateBuilder->where('id', $criteria['id']);
        }
        $user = Auth::user();

        $data = $this->applyCriteria($candidateBuilder, $criteria)->select(['*', 'name as nameOriginal']);
        $data->with(['address', 'user', 'contact', 'user.school']);
        if ($user->roles[0]->id === 10) {
            $data->whereHas('user.school', function ($q) use ($user) {
                $q->where('school_members.school_id', $user->school[0]->id);
            })->get();
        }
        if (isset($schoolId)) {
            $data->whereHas('user.school', function ($q) use ($schoolId) {
                $q->where('school_members.school_id', $schoolId);
            })->get();
        }
        if ($user->roles[0]->id === 13) {
            $data->where('user_id', $user->id);
        }
        return $data->groupBy('user_id')->paginate(Arr::get($criteria, 'perPage', 10));
    }

    private function getBuilder(Builder $builder, array $criteria): Builder
    {
        $status = Arr::get($criteria, 'status');
        $job = Arr::get($criteria, 'job');
        $type = Arr::get($criteria, 'type');

        // listagem para poder chamar candidatos que não estão com contrato ativo e nem em testes
        if ($type) {
            return $builder
                ->whereDoesntHave('contracts', fn(Builder $builder) => $builder
                    ->where('status', '=', ActiveEnum::ACTIVE))
                ->whereDoesntHave(
                    'jobs',
                    fn(Builder $builder) => $builder
                        ->where('status', '=', CandidateStatusEnum::IN_TESTS)
                );
        }

        if (!$status || !$job) {
            return $builder;
        }

        // listagem de cada workflow da vaga, impedindo que quem esteja com contrato ativo/em testes possa passar
        // para outra fase que não do job atual
        return $builder
            ->whereDoesntHave('contracts', fn(Builder $builder) => $builder
                ->where('status', '=', ActiveEnum::ACTIVE))
            ->whereHas(
                'jobs',
                fn(Builder $builder) => $builder
                    ->whereRaw('`jobs`.`id` = ?', [$job])
                    ->where('disapproved', '=', DisapprovedEnum::NOT_DISAPPROVED)
                    ->where('status', '=', $status)
            )->whereDoesntHave(
                'jobs',
                fn(Builder $builder) => $builder
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

    public function getCandidateInInterview($schoolId)
    {
        $users = User::query()->whereHas('candidate')->whereHas('school', function ($q) use ($schoolId) {
            $q->where('school_id', $schoolId);
        })
            ->whereHas('candidate.jobs', function ($query) {
                $query->where('job_candidate.status', '!=', JobCandidateStatusEnum::PENDING);
            })
            ->with(['candidate.address', 'candidate.contact'])
            ->get();

        $candidates = $users->map(function ($item, $key) {
            return $item->candidate;
        });
        return $candidates;
    }

    public function getCandidateHistory(Candidate $candidate)
    {
        $contracts = $candidate->contracts;
        $arr = [];
        foreach ($contracts as $key => $value) {
            $evaluation = $value->company->fctEvaluations()->where('candidate_id', $candidate->id)->first();
            $report = $value->company->fctReports()->where('candidate_id', $candidate->id)->first();
            $arr[] = [
                'startDate' => $value->start_contract_vigence,
                'endDate' => $value->end_contract_vigence,
                'company' => $value->company->corporate_name,
                'evaluation' => $evaluation->evaluation ?? null,
                'fctEvaluationPath' => $evaluation->file_path ?? null,
                'fctReportPath' => $report->report ?? null,
                'totalHours' => $report->total_hours
            ];
        }
        return $arr;
    }

    public function exportHistory($candidate, $format)
    {
        $arr = $this->getCandidateHistory($candidate);
        $zipFile = new ZipArchive();
        $zipName = Str::uuid() . '.zip';
        $zipPath = storage_path('app/public/zip/') . $zipName;
        $zipFile->open($zipPath, ZipArchive::CREATE);

        foreach ($arr as $key => $value) {
            if ($value['fctReportPath']) {
                $splitReportName = explode('/', $value['fctReportPath']);
                $zipFile->addFile(storage_path('app/public/' . $value['fctReportPath']), end($splitReportName));
            }
            if ($value['fctEvaluationPath']) {
                $splitReportName = explode('/', $value['fctEvaluationPath']);
                $zipFile->addFile(storage_path() . '/app' . $value['fctEvaluationPath'], end($splitReportName));
            }
        }

        if ($format === 'excel') {
            $excelName = Str::uuid() . '.xlsx';
            $excelPath = storage_path('app/public/excel/' . $excelName);
            (new FastExcel($arr))->export($excelPath, function ($data) {
                return [
                    'Empresa' => $data['company'],
                    'Período' => $data['startDate']->format('d/m/Y') . ' a ' . $data['endDate']->format('d/m/Y'),
                    'Carga Horária' => $data['totalHours'],
                    'Avaliação' => $data['evaluation'],
                ];
            });
            $zipFile->addFile($excelPath, $excelName);
            $zipFile->close();
            return $zipPath;
        }

        if ($format === 'pdf') {
            $word = new PhpWord();
            $section = $word->addSection();

            $table = $section->addTable(array('borderSize' => 6, 'borderColor' => '000000', 'width' => 10000, 'unit' => 'pct'));

            // Add table header
            $table->addRow();
            $table->addCell(1750)->addText('Empresa', array('bold' => true));
            $table->addCell(1750)->addText('Período', array('bold' => true));
            $table->addCell(1750)->addText('Carga Horária', array('bold' => true));
            $table->addCell(1750)->addText('Avaliação', array('bold' => true));

            // Add data rows using a foreach loop
            foreach ($arr as $row) {
                $table->addRow();
                $table->addCell(1750)->addText($row['company']);
                $table->addCell(1750)->addText($row['startDate']->format('d/m/Y') . ' a ' . $row['endDate']->format('d/m/Y'));
                $table->addCell(1750)->addText($row['totalHours']);
                $table->addCell(1750)->addText($row['evaluation']);
            }

            $wordName = Str::uuid() . '.docx';
            $pdfName = 'teste' . '.pdf';
            $path = storage_path('app/public/docs/' . $wordName);
            $pathPdf = storage_path('app/public/docs/' . $pdfName);
            $word->save($path);

            $rendererName = Settings::PDF_RENDERER_MPDF;
            $rendererLibraryPath = realpath(base_path('vendor/mpdf/mpdf'));
            Settings::setPdfRenderer($rendererName, $rendererLibraryPath);

            $phpWord = IOFactory::load($path);
            $objWriter = IOFactory::createWriter($phpWord, 'PDF');
            $objWriter->save($pathPdf);

            $zipFile->addFile($pathPdf, $pdfName);
            $zipFile->close();
            return $zipPath;
        }

        throw new HttpException(400, 'format unknown');
    }
}
