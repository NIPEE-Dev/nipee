<?php


namespace App\Services\Permissions;


use App\Models\Menu;
use Illuminate\Support\Collection;

class RoleTreeService
{
    const ROOT_LEVEL_ID = -1;

    private $data;

    public function build()
    {
        $this->data = Menu::with('permissions')->orderBy('order')->get();
        return $this->prepareData($this->data)->values();
    }

    private function prepareData(Collection $data, $level = self::ROOT_LEVEL_ID)
    {
        return $data->filter(function ($item) {
            if ($item->parent_id === static::ROOT_LEVEL_ID && $item->permissions->count() === 0 && $this->data->where('parent_id', $item['id'])->count() === 0) {
                return false;
            }

            return true;
        })
            ->where("parent_id", $level)->map(function ($item) use ($data, $level) {
                $item->label = $item->name;
                $item->value = $item->permissions?->first()?->id ?? uniqid();

                $items = $this->data->where('parent_id', $item['id']);
                $item['children'] = $items->isNotEmpty() ? self::prepareData(collect($items), $item['id'])->values() : null;

                return $item;
            });
    }
}
