<?php

namespace App\Downloader;

class BaseDefinition implements IDownladableContent
{
    public function __construct(private readonly array $row)
    {
    }

    public function getRow(): array
    {
        return $this->row;
    }
}