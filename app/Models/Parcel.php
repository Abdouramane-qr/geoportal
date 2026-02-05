<?php

namespace App\Models;

use App\Services\SoilScienceService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Parcel extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'owner_name',
        'geom',
        'status',
        'soil_data',
        'created_by',
        'soil_m',
        'soil_a',
        'soil_b',
        'soil_c',
        'factor_r',
        'factor_ls',
        'factor_c_veg',
        'factor_p_prac',
    ];

    protected $casts = [
        'soil_data' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Parcel $parcel): void {
            if (! $parcel->id) {
                $parcel->id = (string) Str::uuid();
            }
        });

        static::saving(function (Parcel $parcel): void {
            if ($parcel->soil_m === null || $parcel->soil_a === null) {
                $parcel->computed_k = null;
                $parcel->computed_erosion = null;
                $parcel->erosion_risk_level = 'unknown';
                return;
            }

            $science = new SoilScienceService();

            $b = $parcel->soil_b ?? 2;
            $c = $parcel->soil_c ?? 3;

            $parcel->computed_k = $science->calculateKFactor(
                (float) $parcel->soil_m,
                (float) $parcel->soil_a,
                (int) $b,
                (int) $c,
            );

            $parcel->computed_erosion = $science->calculateSoilLoss(
                (float) ($parcel->factor_r ?? 850),
                (float) $parcel->computed_k,
                (float) ($parcel->factor_ls ?? 1.0),
                (float) ($parcel->factor_c_veg ?? 1.0),
                (float) ($parcel->factor_p_prac ?? 1.0),
            );

            $parcel->erosion_risk_level = $science->determineRiskLevel(
                (float) $parcel->computed_erosion
            );
        });
    }
}
