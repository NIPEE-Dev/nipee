<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::statement("ALTER TABLE jobs MODIFY gender ENUM('F', 'M', 'FM') NOT NULL");
    }

    public function down()
    {
        DB::statement("ALTER TABLE jobs MODIFY gender ENUM('F', 'M') NOT NULL");
    }
};
