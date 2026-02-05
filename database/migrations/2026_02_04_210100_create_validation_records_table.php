<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('validation_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('parcel_id');
            $table->text('parcel_name');
            if (DB::getDriverName() === 'pgsql') {
                $table->jsonb('original_data')->default(DB::raw("'{}'::jsonb"));
            } else {
                $table->json('original_data')->default('{}');
            }
            $table->string('current_step')->default('import');
            if (DB::getDriverName() === 'pgsql') {
                $table->jsonb('step_status')->default(DB::raw("'{\"import\":\"pending\",\"detection\":\"pending\",\"correction\":\"pending\",\"validation\":\"pending\"}'::jsonb"));
            } else {
                $table->json('step_status')->default('{"import":"pending","detection":"pending","correction":"pending","validation":"pending"}');
            }
            $table->foreignUuid('validated_by')->nullable()->constrained('profiles')->nullOnDelete();
            $table->timestampTz('validated_at')->nullable();
            $table->timestampsTz();

            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->change();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE validation_records ADD CONSTRAINT validation_records_current_step_check CHECK (current_step IN ('import','detection','correction','validation'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('validation_records');
    }
};
