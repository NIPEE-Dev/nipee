<?php

namespace Database\Factories\Financial;

use App\Models\Financial\FinancialClose;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinancialCloseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FinancialClose::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'start_date' => now()->subMonth()->format("Y-m-d H:i:s"),
            'end_date' => now()->format("Y-m-d H:i:s"),
            'status' => '0',
        ];
    }
}
