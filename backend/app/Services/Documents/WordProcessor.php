<?php

namespace App\Services\Documents;

use App\Enums\Document\DocumentTypeTemplateEnum;
use Illuminate\Support\Facades\File;
use PhpOffice\PhpWord\TemplateProcessor;

class WordProcessor
{
    public function make(DocumentTypeTemplateEnum $template, $replacements, callable $customProcessor = null): array
    {
        $templateProcessor = new TemplateProcessor($this->getPathByTemplate($template));
        $templateProcessor->setValues($replacements);

        if ($customProcessor) {
            $customProcessor($templateProcessor);
        }

        $filename = DocumentTypeTemplateEnum::getFilenameByTemplate($template);
        $randomName = uniqid(more_entropy: true);

        $path = storage_path('app/generated_documents/' . config('app.system_identifier') . '/' . $randomName . '.docx');
        $templateProcessor->saveAs($path);
        $filesize = File::size($path);

        return compact('filename', 'randomName', 'filesize', 'path');
    }

    public function getPathByTemplate(DocumentTypeTemplateEnum $template): string
    {
        return storage_path('app/base_documents/' . config('app.system_identifier') . '/' . $template->value . '.docx');
    }
}