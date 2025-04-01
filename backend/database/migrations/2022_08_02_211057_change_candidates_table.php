<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('candidates', function (Blueprint $table) {
            DB::statement("ALTER TABLE candidates MODIFY piercing ENUM('0', '1') NULL");
            DB::statement("ALTER TABLE candidates MODIFY tattoo ENUM('0', '1') NULL");
            DB::statement("ALTER TABLE candidates MODIFY smoker ENUM('0', '1') NULL");
            DB::statement("ALTER TABLE candidates MODIFY marital_status ENUM('S', 'C', 'V', 'D') NULL");
            DB::statement("ALTER TABLE candidates MODIFY sons ENUM('0', '1') NULL");

            $table->string('how_find_us', 255)->nullable()->change();
            $table->string('how_find_us_name', 255)->nullable()->change();
            $table->text('candidate_observations')->nullable()->change();

            $table->string('tags', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('candidates', function (Blueprint $table) {
            DB::statement("ALTER TABLE candidates MODIFY piercing ENUM('0', '1') NOT NULL");
            DB::statement("ALTER TABLE candidates MODIFY tattoo ENUM('0', '1') NOT NULL");
            DB::statement("ALTER TABLE candidates MODIFY smoker ENUM('0', '1') NOT NULL");
            DB::statement("ALTER TABLE candidates MODIFY marital_status ENUM('S', 'C', 'V', 'D') NOT NULL");
            DB::statement("ALTER TABLE candidates MODIFY sons ENUM('0', '1') NOT NULL");

            $table->string('how_find_us', 255)->change();
            $table->string('how_find_us_name', 255)->change();
            $table->text('candidate_observations')->change();

            // @TODO: criar tabela de tags
            $table->string('tags', 255)->change();
        });
    }
};
