<?php

namespace App\Traits\Common;

use Error;
use Illuminate\Support\Str;

trait TransformArrayKeysToSnakeCase
{
    public function transformArrayKeysToSnakeCase(array $arr)
    {
        if (!is_array($arr)) {
            throw new Error('Argumento $arr deve ser um array');
        }

        $data = [];
        foreach ($arr as $key => $value) {
            $data[Str::snake($key)] = $value;
        }

        return $data;
    }
}
