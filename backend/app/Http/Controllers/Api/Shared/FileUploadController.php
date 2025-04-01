<?php

namespace App\Http\Controllers\Api\Shared;

use App\Enums\FileUploadTypeEnum;
use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\Contracts\Contract;
use App\Models\Jobs\Job;
use App\Models\School;
use App\Services\FileUploadService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class FileUploadController
{
    /**
     * @throws Exception
     */
    public function __invoke(Request $request, FileUploadService $fileUploadService): JsonResponse
    {
        $type = FileUploadTypeEnum::from($request->post('type'));
        $modelName = $request->post('model');
        $model = $this->getInstance($modelName, $request->post('id'));
        if (!$model) {
            throw new Exception("Conteúdo não encontrado para salvar arquivo");
        }

        /**
         * @var UploadedFile[] $files
         */
        $files = $request->file('files');
        $createdFiles = [];
        $fileUploadService->setPaste('../generated_documents/' . config('app.system_identifier'));
        foreach ($files as $file) {
            $filename = $fileUploadService->store($file);
            $createdFiles[] = $model->documents()->create([
                'filename' => pathinfo($filename, PATHINFO_FILENAME),
                'original_filename' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'file_extension' => $file->getClientOriginalExtension(),
                'filesize' => $file->getSize(),
                'type' => FileUploadTypeEnum::getLabel($type),
            ]);
        }

        return new JsonResponse(['success' => true, 'files' => $createdFiles]);
    }

    private function getInstance(string $model, $id)
    {
        $model = $this->retrieveModelName($model);
        return $this->getModelInstance($model, $id);
    }

    private function retrieveModelName(string $model): string
    {
        return match ($model) {
            'Company' => Company::class,
            'Contract' => Contract::class,
            'School' => School::class,
            'Candidate' => Candidate::class,
            'Job' => Job::class,
        };
    }

    private function getModelInstance($model, $id)
    {
        return app($model)->findOrFail($id);
    }
}