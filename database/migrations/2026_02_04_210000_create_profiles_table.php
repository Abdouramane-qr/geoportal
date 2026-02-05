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
            DB::statement('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
        }

        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->text('full_name')->nullable();
            $table->string('role')->default('agronome');
            $table->timestampsTz();

            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->change();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('agronome','admin','autorite'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
