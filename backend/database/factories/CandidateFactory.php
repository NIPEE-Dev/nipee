<?php

namespace Database\Factories;

use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

class CandidateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Candidate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'birth_day' => $this->faker->dateTimeBetween('1990-01-01', '2000-12-31'),
            'cpf' => '434.432.657-90',
            'rg' => '55.434.435-6',
            'gender' => "F",
            'studying_level' => "M",
            'mandatory_internship',
            'course',
            'semester',
            'serie',
            'ra',
            'period',
            'school_id',
            'interest',
            'piercing',
            'tattoo',
            'smoker',
            'sons',
            'marital_status',
            'how_find_us',
            'how_find_us_name',
            'candidate_observations',
            'tags',
        ];
    }
}
