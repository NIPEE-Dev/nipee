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
        Schema::create('courses_schools', function (Blueprint $table) {
            $table->bigInteger('course_id')->unsigned()->notNull();
            $table->bigInteger('school_id')->unsigned()->notNull();
            $table->primary(['course_id', 'school_id']);
            
            $table->foreign('course_id')->references('id')->on('base_records')->onDelete('cascade');
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });

        DB::unprepared('
            CREATE TRIGGER validate_base_record_type
            BEFORE INSERT ON courses_schools
            FOR EACH ROW
            BEGIN
                DECLARE base_type INT;

                -- Retrieve the type from base_records.
                SELECT type INTO base_type
                FROM base_records
                WHERE id = NEW.course_id;

                -- Validate that the base record type is 6.
                IF base_type <> 6 THEN
                    SIGNAL SQLSTATE "45000"
                        SET MESSAGE_TEXT = "Only type 6 base records (courses) are allowed in this relationship.";
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS validate_base_record_type');
        Schema::dropIfExists('courses_schools');
    }
};
