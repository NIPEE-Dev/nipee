<?php

namespace Database\Seeders;

use App\Models\Users\Roles\Role;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();
        Role::insert([
            ['id' => '1', 'title' => 'Administrador Geral', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '5', 'title' => 'Vendedor', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '6', 'title' => 'Recrutamento e Seleção', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '7', 'title' => 'Administrativo', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '8', 'title' => 'Estagiária de RH', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '9', 'title' => 'Estagiária de Adm', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '10','title' => 'Escola', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '11','title' => 'Aprovador Pré-Registo Empresa', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '12','title' => 'Aprovador Pré-Registo Candidato', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '13','title' => 'Candidato', 'created_at' => $now, 'updated_at' => $now, null],
            ['id' => '14','title' => 'Empresa', 'created_at' => $now, 'updated_at' => $now, null],
        ]);

    }
}
