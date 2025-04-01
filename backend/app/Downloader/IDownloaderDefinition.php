<?php

namespace App\Downloader;

use App\Services\FiltersService;
use Illuminate\Database\Eloquent\Builder;

interface IDownloaderDefinition
{
    public function definition(IDownladableContent $content);

    public function model(): string;

    public function relations(): array;

    public function internalization(): string;

    public function header($row): array;

    public function specialConditions(FiltersService $filtersService): void;
}