<?php

namespace App\Downloader\Decorators;

use App\Downloader\IDownladableContent;
use Illuminate\Support\Arr;

class DownloaderDotDecorator implements IDownladableContent
{
    public function __construct(public readonly IDownladableContent $row)
    {
    }

    public function getRow(): array
    {
        return Arr::dot($this->row->getRow());
    }
}