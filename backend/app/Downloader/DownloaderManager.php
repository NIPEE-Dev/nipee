<?php

namespace App\Downloader;

use App\Downloader\Decorators\DefaultDefinitionDecorator;
use App\Downloader\Decorators\DownloaderDotDecorator;
use App\Enums\TableDownloadTypeEnum;
use App\Traits\Common\Filterable;
use OpenSpout\Common\Exception\InvalidArgumentException;
use OpenSpout\Common\Exception\IOException;
use OpenSpout\Common\Exception\UnsupportedTypeException;
use OpenSpout\Writer\Exception\WriterNotOpenedException;
use Rap2hpoutre\FastExcel\FastExcel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloaderManager
{
    use Filterable;

    private IDownloaderDefinition $downloaderDefinition;

    /**
     * @throws WriterNotOpenedException
     * @throws IOException
     * @throws UnsupportedTypeException
     * @throws InvalidArgumentException
     */
    public function download(TableDownloadTypeEnum $resource): StreamedResponse|string
    {
        $this->downloaderDefinition = DownloaderFactory::make($resource);

        return (new FastExcel($this->get()))->download($this->downloaderDefinition->internalization() . '.xlsx', function ($row) {
            return $this->downloaderDefinition->header($row);
        });
    }

    private function get()
    {
        $instance = $this->getModelInstance();
        foreach ($instance as $row) {
            $row->load($this->downloaderDefinition->relations());
            yield $this->downloaderDefinition->definition(new DefaultDefinitionDecorator(new DownloaderDotDecorator(new BaseDefinition($row->toArray()))));
        }
    }

    protected function getModelInstance()
    {
        $this->bootFilters();
        $builder = resolve($this->downloaderDefinition->model())->query();
        $this->downloaderDefinition->specialConditions($this->filtersService);

        return $this->applyCriteria($builder->orderBy('id', 'desc'), request()->all())->cursor();
    }
}