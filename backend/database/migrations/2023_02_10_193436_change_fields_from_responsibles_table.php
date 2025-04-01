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
        Schema::table('responsibles', function (Blueprint $table) {
            $table->string('email', 255)->nullable()->change();
            $table->string('role', 255)->nullable()->change();
            $table->string('document', 30)->nullable()->change();
            $table->dateTime('birth_day')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('responsibles', function (Blueprint $table) {
            $table->string('email', 255)->change();
            $table->string('role', 255)->change();
            $table->string('document', 30)->change();
            $table->dateTime('birth_day')->change();
        });
    }
};
