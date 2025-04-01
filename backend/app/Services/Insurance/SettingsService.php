<?php

namespace App\Services\Insurance;

use App\Models\Insurance\Settings;
use App\Traits\Common\Filterable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;

class SettingsService
{
    use Filterable;

    public function index($criteria): LengthAwarePaginator
    {
        return $this->applyCriteria(Settings::query(), $criteria)->paginate(Arr::get($criteria, 'perPage', 10));
    }
}