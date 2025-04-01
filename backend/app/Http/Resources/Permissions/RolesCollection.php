<?php

namespace App\Http\Resources\Permissions;

use Illuminate\Http\Resources\Json\ResourceCollection;

class RolesCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->transform(function ($role) {
                $role->value = $role->id;
                $role->label = $role->title;

                return $role;
            })
        ];
    }
}