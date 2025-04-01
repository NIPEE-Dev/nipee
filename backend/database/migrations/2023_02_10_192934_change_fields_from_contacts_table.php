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
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('cellphone', 30)->nullable()->change();
            $table->string('email', 255)->nullable()->change();
            $table->string('role', 255)->nullable()->change();
            $table->string('talk_to', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('cellphone', 30)->change();
            $table->string('email', 255)->change();
            $table->string('role', 255)->change();
            $table->string('talk_to', 255)->change();
        });
    }
};
