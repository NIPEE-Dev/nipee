<?php

namespace App\Downloader\Decorators;

use App\Downloader\DownloadReplaceHelper;
use App\Downloader\IDownladableContent;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DefaultDefinitionDecorator implements IDownladableContent
{
    const BOOLEAN_COLUMNS = [
        'retroative_billing',
        'recolocation',
        'available',
        'show_web',
        'piercing',
        'tattoo',
        'smoker',
        'sons',
        'business_day',
        'issue_invoice',
        'issue_bank_slip',
    ];

    public function __construct(public readonly IDownladableContent $row)
    {
    }

    public function getRow(): array
    {
        return Collection::make($this->row->getRow())->map(function ($value, $key) {
            DownloadReplaceHelper::from($key, 'created_at', $value, fn() => Carbon::parse($value)->format("d/m/Y H:i:s"));
            DownloadReplaceHelper::from($key, 'updated_at', $value, fn() => Carbon::parse($value)->format("d/m/Y H:i:s"));
            DownloadReplaceHelper::from($key, 'deleted_at', $value, fn() => Carbon::parse($value)->format("d/m/Y H:i:s"));

            if (!empty(array_filter(static::BOOLEAN_COLUMNS, fn($item) => str_contains($key, $item)))) {
                $value = (bool)$value;
                $value = $value ? "Sim" : 'Não';
            }

            return $value;
        })->toArray();
    }
}