<?php

use App\Models\Users\Roles\Permission;
use App\Models\Users\Roles\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionRoleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permission_role', function (Blueprint $table) {
            $table->id()->autoIncrement();

            $table->foreignId('role_id')->references('id')->on((new Role())->getTable());
            $table->foreignId('permission_id')->references('id')->on((new Permission())->getTable());

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
        Schema::dropIfExists('permissions_roles');
    }
}
