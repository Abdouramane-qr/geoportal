<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserManagementApiTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create();
        $admin->profile()->update(['role' => 'admin']);
        Sanctum::actingAs($admin);

        return $admin;
    }

    public function test_admin_can_list_users(): void
    {
        $this->actingAsAdmin();
        User::factory()->count(2)->create();

        $response = $this->getJson('/api/users');
        $response->assertOk();
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');
        $response->assertForbidden();
    }

    public function test_admin_can_create_user_with_role(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson('/api/users', [
            'name' => 'Mobile Admin',
            'email' => 'mobile.admin@example.com',
            'password' => 'Password#12345',
            'role' => 'autorite',
            'full_name' => 'Mobile Admin Full',
        ]);

        $response->assertCreated()
            ->assertJsonPath('profile.role', 'autorite');
    }

    public function test_admin_can_update_user_role(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create();

        $response = $this->patchJson("/api/users/{$target->id}", [
            'role' => 'admin',
        ]);

        $response->assertOk()
            ->assertJsonPath('profile.role', 'admin');
    }

    public function test_admin_cannot_delete_self(): void
    {
        $admin = $this->actingAsAdmin();

        $response = $this->deleteJson("/api/users/{$admin->id}");
        $response->assertForbidden();
    }
}
