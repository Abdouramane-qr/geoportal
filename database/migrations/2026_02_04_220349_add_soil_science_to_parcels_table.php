<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('parcels', function (Blueprint $table) {
            $table->float('soil_m')->nullable()->comment('Indice granulométrique (M)');
            $table->float('soil_a')->nullable()->comment('Pourcentage matière organique (a)');
            $table->integer('soil_b')->nullable()->comment('Code structure (1:Granulaire à 4:Massive)');
            $table->integer('soil_c')->nullable()->comment('Code perméabilité (1:Rapide à 6:Très lente)');

            $table->float('factor_r')->default(850)->comment('Érosivité des pluies (R) - Moyenne locale');
            $table->float('factor_ls')->default(1.0)->comment('Facteur topographique (LS)');
            $table->float('factor_c_veg')->default(1.0)->comment('Couvert végétal (C) - 0 à 1');
            $table->float('factor_p_prac')->default(1.0)->comment('Pratiques anti-érosives (P) - 0 à 1');

            $table->float('computed_k')->nullable()->comment('Résultat Facteur K');
            $table->float('computed_erosion')->nullable()->comment('Perte de sol en t/ha/an (A)');

            $table->string('erosion_risk_level')->default('unknown');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parcels', function (Blueprint $table) {
            $table->dropColumn([
                'soil_m',
                'soil_a',
                'soil_b',
                'soil_c',
                'factor_r',
                'factor_ls',
                'factor_c_veg',
                'factor_p_prac',
                'computed_k',
                'computed_erosion',
                'erosion_risk_level',
            ]);
        });
    }
};
