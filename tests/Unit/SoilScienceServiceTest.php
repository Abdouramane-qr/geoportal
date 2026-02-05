<?php

namespace Tests\Unit;

use App\Services\SoilScienceService;
use PHPUnit\Framework\TestCase;

class SoilScienceServiceTest extends TestCase
{
    public function test_calculate_k_factor_is_non_negative(): void
    {
        $service = new SoilScienceService();

        $k = $service->calculateKFactor(0.1, 50, 1, 6);

        $this->assertGreaterThanOrEqual(0.0, $k);
    }

    public function test_calculate_soil_loss(): void
    {
        $service = new SoilScienceService();

        $loss = $service->calculateSoilLoss(850, 0.03, 1.0, 1.0, 1.0);

        $this->assertEquals(25.5, $loss);
    }

    public function test_determine_risk_level(): void
    {
        $service = new SoilScienceService();

        $this->assertSame('low', $service->determineRiskLevel(4.9));
        $this->assertSame('moderate', $service->determineRiskLevel(5.0));
        $this->assertSame('high', $service->determineRiskLevel(12.0));
        $this->assertSame('critical', $service->determineRiskLevel(25.0));
    }
}
