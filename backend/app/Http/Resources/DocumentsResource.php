<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use ReflectionException;

class DocumentsResource extends JsonResource
{
    /**
     * @throws ReflectionException
     */
    public function toArray($request)
    {
        $name = (new \ReflectionClass($this->attachable_type))->getShortName();
        return array_merge(parent::toArray($request), [
            'name' => $name
        ]);
    }
}