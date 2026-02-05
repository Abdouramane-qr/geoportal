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
        Schema::create('validation_corrections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('validation_record_id')->constrained('validation_records')->cascadeOnDelete();
            $table->text('field');
            $table->text('original_value');
            $table->text('proposed_value');
            $table->text('reason');
            $table->boolean('accepted')->nullable();
            $table->timestampsTz();

            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('validation_corrections');
    }
};
