<?php

namespace App\Services;

class SoilScienceService
{
    public function calculateKFactor(float $M, float $a, int $b, int $c): float
    {
        $term1 = 2.1 * pow(10, -4) * pow($M, 1.14) * (12 - $a);
        $term2 = 3.25 * ($b - 2);
        $term3 = 2.5 * ($c - 3);

        $k = ($term1 + $term2 + $term3) / 100;

        return max(0.0, $k);
    }

    public function calculateSoilLoss(float $R, float $K, float $LS, float $C, float $P): float
    {
        return $R * $K * $LS * $C * $P;
    }

    public function determineRiskLevel(float $soilLoss): string
    {
        if ($soilLoss < 5) {
            return 'low';
        }
        if ($soilLoss < 12) {
            return 'moderate';
        }
        if ($soilLoss < 25) {
            return 'high';
        }

        return 'critical';
    }
}
