<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();

            $table->string('name', 255);
            $table->dateTime('birth_day');
            $table->string('cpf', 14);
            $table->string('rg', 15);
            $table->enum('gender', ['F', 'M']);
            $table->enum('studying_level', ['E', 'M', 'TS']);

            // @TODO: criar tabela de cursos e vincular aqui tb
            $table->string('course', 255);

            $table->tinyInteger('semester')->unsigned();
            $table->string('ra', 40);
            $table->enum('period', ['M', 'T', 'N']);
            $table->string('school', 255);
            $table->enum('interest', ['ES', 'EF', 'AM']);

            $table->enum('piercing', ['0', '1']);
            $table->enum('tattoo', ['0', '1']);
            $table->enum('smoker', ['0', '1']);
            $table->enum('marital_status', ['S', 'C', 'V', 'D']);
            $table->enum('sons', ['0', '1']);

            $table->string('how_find_us', 255);
            $table->string('how_find_us_name', 255);
            $table->text('candidate_observations');

            // @TODO: criar tabela de tags
            $table->string('tags', 255);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidates');
    }
};
