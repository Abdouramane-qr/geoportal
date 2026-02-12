<?php

namespace Tests\Feature;

use App\Models\Parcel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ParcelStatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_parcel_status(): void
    {
        $user = User::factory()->create();
        $parcel = Parcel::create([
            'owner_name' => 'Owner',
            'status' => 'draft',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson("/parcels/{$parcel->id}/status", [
                'status' => 'validated',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'id' => $parcel->id,
                'status' => 'validated',
            ]);

        $this->assertDatabaseHas('parcels', [
            'id' => $parcel->id,
            'status' => 'validated',
        ]);
    }

    public function test_guest_cannot_update_parcel_status(): void
    {
        $parcel = Parcel::create([
            'owner_name' => 'Owner',
            'status' => 'draft',
        ]);

        $response = $this->patchJson("/parcels/{$parcel->id}/status", [
            'status' => 'validated',
        ]);

        $response->assertUnauthorized();
    }

    public function test_status_update_requires_valid_status_value(): void
    {
        $user = User::factory()->create();
        $parcel = Parcel::create([
            'owner_name' => 'Owner',
            'status' => 'draft',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson("/parcels/{$parcel->id}/status", [
                'status' => 'invalid-status',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_autorite_role_cannot_update_parcel_status(): void
    {
        $user = User::factory()->create();
        $user->profile()->update(['role' => 'autorite']);

        $parcel = Parcel::create([
            'owner_name' => 'Owner',
            'status' => 'draft',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson("/parcels/{$parcel->id}/status", [
                'status' => 'validated',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('parcels', [
            'id' => $parcel->id,
            'status' => 'draft',
        ]);
    }
}
