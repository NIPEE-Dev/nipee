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
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->string('status')->default('Pendente')->nullable();
            $table->string('status_update')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('password_creation_link')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('reject_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students_pre_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'status_update',
                'rejection_reason',
                'password_creation_link',
                'approved_at',
                'reject_at',
            ]);
        });
    }
};

