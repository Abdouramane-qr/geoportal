<?php

namespace Tests\Feature;

use App\Models\Parcel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ParcelApiAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_parcel_via_api(): void
    {
        $response = $this->postJson('/api/parcels', [
            'owner_name' => 'Owner',
        ]);

        $response->assertUnauthorized();
    }

    public function test_guest_cannot_update_or_delete_parcel_via_api(): void
    {
        $parcel = Parcel::create([
            'owner_name' => 'Owner',
            'status' => 'draft',
        ]);

        $this->patchJson("/api/parcels/{$parcel->id}", [
            'owner_name' => 'Updated Owner',
        ])->assertUnauthorized();

        $this->deleteJson("/api/parcels/{$parcel->id}")->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_parcel_via_api(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/parcels', [
                'owner_name' => 'Owner',
                'status' => 'draft',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('owner_name', 'Owner');
    }
}
