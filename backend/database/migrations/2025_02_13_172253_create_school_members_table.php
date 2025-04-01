<?php

use App\Models\Candidate;
use App\Models\Company\Company;
use App\Models\School;
use App\Models\SchoolMember;
use App\Models\Users\User;
use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('school_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on((new User())->getTable());
            $table->foreignId('school_id')->references('id')->on((new School())->getTable());
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
        Schema::dropIfExists('school_members');
    }
};
