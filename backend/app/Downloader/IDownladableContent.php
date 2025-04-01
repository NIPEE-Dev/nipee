<?php

namespace App\Downloader;

interface IDownladableContent
{
    public function getRow(): array;
}