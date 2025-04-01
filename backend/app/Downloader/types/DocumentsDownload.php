<?php

namespace App\Downloader\types;

use App\Downloader\DownloadReplaceHelper;
use App\Downloader\IDownladableContent;
use App\Downloader\IDownloaderDefinition;
use App\Enums\Document\DocumentStatusEnum;
use App\Helpers\Filter;
use App\Models\Document;
use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class DocumentsDownload extends BaseTypeDownload implements IDownloaderDefinition
{

    public function definition(IDownladableContent $content)
    {
        return Collection::make($content->getRow())->map(function ($value, $key) {
            DownloadReplaceHelper::exact($key, 'status', $value, fn() => DocumentStatusEnum::getLabel(DocumentStatusEnum::from($value)));
            return $value;
        })->toArray();
    }

    public function model(): string
    {
        return Document::class;
    }

    public function internalization(): string
    {
        return 'Documentos';
    }

    public function header($row): array
    {
        return [
            'ID' => $row['id'],
            'Nome do arquivo' => $row['filename'],
            'Nome original do arquivo' => $row['original_filename'],
            'Extensão do arquivo' => $row['file_extension'],
            'Tamanho do arquivo' => $row['filesize'],
            'Tipo' => $row['type'],
            'Status' => $row['status'],
            'Criado em' => $row['created_at'],
            'Atualizado em' => $row['updated_at'],
            'Deletado em' => $row['deleted_at'],
        ];
    }

    public function specialConditions(FiltersService $filtersService): void
    {
        $filtersService->addSpecialField('created_at', function (Builder $builder, Filter $filter) {
            return $builder->whereBetween('created_at', [$filter->getValue()[0] . ' 00:00:00', $filter->getValue()[1] . ' 23:59:59']);
        });
    }
}