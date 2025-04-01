<?php

namespace Database\Factories\Users;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name('male'),
            'email' => $this->faker->unique()->safeEmail(),
            // 'password' => bcrypt('123'),
            'commission' => 10,
            'start_hour' => "00:00:00",
            'end_hour' => "23:59:59",
        ];
    }
}
