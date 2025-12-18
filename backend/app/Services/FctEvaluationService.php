<?php

namespace App\Services;

use App\Enums\FctEvaluationStatusEnum;
use App\Models\FctEvaluation;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\TemplateProcessor;
use Symfony\Component\HttpKernel\Exception\HttpException;

class FctEvaluationService
{
    public function getByCompanyId($companyId)
    {
        $evaluations = FctEvaluation::query()->where('company_id', $companyId)->get();

        return $evaluations;
    }

    public function getBySchoolId($schoolId)
    {
        $evaluations = FctEvaluation::query()->where('school_id', $schoolId)->get();

        return $evaluations;
    }

    public function getByCandidateId($candidateId)
    {
        $evaluations = FctEvaluation::query()->where('candidate_id', $candidateId)->get();

        return $evaluations;
    }

    public function create($data)
    {
        $id = $data['id'];

        $evaluation = FctEvaluation::query()->where('id', $id)->first();
        if (!isset($evaluation)) throw new HttpException(400, 'Avaliação não encontrada');

        $contract = $evaluation->candidate->contracts()->where('company_id', $evaluation->company->id)->where('status', '1')->first();
        $startDate = $contract->start_contract_vigence->format('d/m/Y');
        $endDate = $contract->end_contract_vigence->format('d/m/Y');
        $templateProcessor = new TemplateProcessor(storage_path('app/base_documents/' . config('app.system_identifier') . '/' . 'fctEvaluation.docx'));
        $templateProcessor->setValue('candidateName', $evaluation->candidate->name, 1);
        $templateProcessor->setValue('schoolName', $evaluation->school->corporate_name, 1);
        $templateProcessor->setValue('companyName', $evaluation->company->corporate_name, 1);
        $templateProcessor->setValue('role', $evaluation->job->role, 1);
        $templateProcessor->setValue('formationArea', $evaluation->candidate->userCourse->title, 1);
        $templateProcessor->setValue('fctDate', "$startDate - $endDate", 1);
        $templateProcessor->setValue('monitorName', $evaluation->company->supervisor, 1);

        foreach ($data as $key => $value) {
            $templateProcessor->setValue($key, $value, 1);
        }

        $randomName = uniqid(more_entropy: true);
        $path = storage_path('app/generated_documents/' . config('app.system_identifier') . '/' . $randomName . '.docx');
        $pathPdf = storage_path('app/generated_documents/' . config('app.system_identifier') . '/' . $randomName . '.pdf');
        $templateProcessor->saveAs($path);

        $rendererName = Settings::PDF_RENDERER_MPDF;
        $rendererLibraryPath = realpath(base_path('vendor/mpdf/mpdf'));
        Settings::setPdfRenderer($rendererName, $rendererLibraryPath);

        $phpWord = IOFactory::load($path);
        $objWriter = IOFactory::createWriter($phpWord, 'PDF');
        $objWriter->save($pathPdf);

        $evaluation->evaluation = $data['totalPontuation'];
        $evaluation->file_path = '/generated_documents/' . config('app.system_identifier') . '/' . $randomName . '.pdf';
        $evaluation->status = FctEvaluationStatusEnum::WAITING_UPLOAD->value;
        $evaluation->save();
    }

    public function upload($evaluationId, $file)
    {
        $evaluation = FctEvaluation::query()->where('id', $evaluationId)->first();
        if (!isset($evaluation)) throw new HttpException(400, 'Avaliação não encontrada');

        $fileName = uniqid();
        $fileExtension = $file->getClientOriginalExtension();
        Storage::disk('local')->put('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension, file_get_contents($file));
        $evaluation->file_path = '/generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension;
        $evaluation->status = FctEvaluationStatusEnum::CONCLUDED->value;
        $evaluation->save();
    }
}
