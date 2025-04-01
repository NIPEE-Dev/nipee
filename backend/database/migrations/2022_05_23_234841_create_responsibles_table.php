<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('responsibles', function (Blueprint $table) {
            $table->id();
            $table->morphs('responsible');

            $table->string('name', 255);
            $table->string('phone', 30);
            $table->string('email', 255);
            $table->string('role', 255);
            $table->string('document', 30);
            $table->dateTime('birth_day');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('responsibles');
    }
};
