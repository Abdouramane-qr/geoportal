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
        Schema::create('validation_errors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('validation_record_id')->constrained('validation_records')->cascadeOnDelete();
            $table->text('field');
            $table->text('value');
            $table->text('rule');
            $table->text('message');
            $table->string('severity')->default('error');
            $table->timestampTz('created_at')->useCurrent();

            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->change();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE validation_errors ADD CONSTRAINT validation_errors_severity_check CHECK (severity IN ('error','warning'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('validation_errors');
    }
};
