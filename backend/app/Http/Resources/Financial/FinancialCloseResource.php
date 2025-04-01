<?php

namespace App\Http\Resources\Financial;

use Illuminate\Http\Resources\Json\JsonResource;

class FinancialCloseResource extends JsonResource
{
    private array $commissions = [];

    public function toArray($request)
    {
        $companies = $this->companies;

        return [
            'id' => $this->id,
            'reference_date' => ucfirst($this->reference_date->translatedFormat("F/Y")),
            'total' => $this->totalFinancialCloseValue(),
            'candidates_count' => $companies->pluck('items')->collapse()->count(),
            'status' => $this->status,
            'created_at' => $this->created_at->format("d/m/Y"),
            'updated_at' => $this->updated_at->format("d/m/Y"),
            'companies' => $companies->map(fn($company) => [
                'company' => $company->company,
                'company_id' => $company->company_id,
                'created_at' => $company->created_at,
                'financial_close_id' => $company->financial_close_id,
                'id' => $company->id,
                'items' => $company->items,
                'total_value' => $company->totalValue(),
                'updated_at' => $company->updated_at,
            ]),
            'commissions' => $this->buildCommission()
        ];
    }
}