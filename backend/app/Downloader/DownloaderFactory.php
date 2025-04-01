<?php

namespace App\Downloader;

use App\Downloader\types\CandidatesDownload;
use App\Downloader\types\CompaniesDownload;
use App\Downloader\types\ContractsDownload;
use App\Downloader\types\DocumentsDownload;
use App\Downloader\types\JobsDownload;
use App\Downloader\types\SchoolsDownload;
use App\Enums\TableDownloadTypeEnum;

class DownloaderFactory
{
    public static function make(TableDownloadTypeEnum $resource): IDownloaderDefinition
    {
        $type = match ($resource) {
            TableDownloadTypeEnum::Jobs => JobsDownload::class,
            TableDownloadTypeEnum::Companies => CompaniesDownload::class,
            TableDownloadTypeEnum::Schools => SchoolsDownload::class,
            TableDownloadTypeEnum::Candidates => CandidatesDownload::class,
            TableDownloadTypeEnum::Contracts => ContractsDownload::class,
            TableDownloadTypeEnum::Documents => DocumentsDownload::class,
        };

        return resolve($type);
    }
}