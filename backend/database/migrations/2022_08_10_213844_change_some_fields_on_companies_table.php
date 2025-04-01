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
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('type', ['PJ', 'PF'])->default('PJ')->after('corporate_name');
            $table->string('cnpj', 18)->nullable()->change();
            $table->string('cpf')->after('cnpj')->nullable();
            $table->string('oab', 100)->after('cpf')->nullable();
            $table->string('crcsp', 100)->after('oab')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->string('cnpj', 18)->change();
            $table->dropColumn('cpf');
            $table->dropColumn('oab');
            $table->dropColumn('crcsp');
        });
    }
};
