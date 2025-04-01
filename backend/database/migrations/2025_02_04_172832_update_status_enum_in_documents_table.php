<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::statement("ALTER TABLE documents MODIFY status ENUM('0', '1', '2', '3', '4', '5', '6') NOT NULL DEFAULT '3'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE documents MODIFY status ENUM('0', '1', '2') NOT NULL DEFAULT '0'");
    }
};
