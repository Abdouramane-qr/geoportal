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
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        }

        Schema::create('parcels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('owner_name')->nullable();
            $table->enum('status', ['draft', 'validated', 'official'])->default('draft');
            $table->jsonb('soil_data')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('profiles')->nullOnDelete();
            $table->timestamps();

            if (DB::getDriverName() !== 'pgsql') {
                $table->text('geom')->nullable();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE parcels ADD COLUMN geom geometry(MultiPolygon, 4326)');
            DB::statement('CREATE INDEX parcels_geom_gist ON parcels USING GIST (geom)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcels');
    }
};
