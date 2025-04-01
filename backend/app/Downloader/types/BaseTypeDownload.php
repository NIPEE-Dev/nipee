<?php

namespace App\Downloader\types;

use App\Downloader\IDownladableContent;
use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;

class BaseTypeDownload
{
    public function definition(IDownladableContent $content)
    {
        return $content->getRow();
    }

    public function relations(): array
    {
        return [];
    }

    public function specialConditions(FiltersService $filtersService): void
    {}
}