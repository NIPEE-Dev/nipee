<?php

namespace App\Http\Resources\Financial;

use Illuminate\Http\Resources\Json\JsonResource;

class FinancialCloseListResource extends JsonResource
{
    public function toArray($request)
    {
        $total = (int)$this->total_value;
        if ($total === 0) {
            $total = $this->totalFinancialCloseValue();
        }

        return [
            'id' => $this->id,
            'reference_date' => ucfirst($this->reference_date->translatedFormat("F/Y")),
            'total' => $total,
            'status' => $this->status,
            'created_at' => $this->created_at->format("d/m/Y"),
        ];
    }
}