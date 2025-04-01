<?php

namespace App\Http\Controllers\Api\Shared;

use App\Downloader\DownloaderManager;
use App\Enums\TableDownloadTypeEnum;
use App\Services\DownloaderService;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TableDownloadController extends DownloaderService
{
    /**
     * @throws Exception
     */
    public function __invoke(Request $request, TableDownloadTypeEnum $resource, DownloaderManager $downloaderManager): StreamedResponse|string
    {
        return $downloaderManager->download($resource);
    }
}