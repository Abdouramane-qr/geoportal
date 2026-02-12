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
        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'current_page',
                'last_page',
                'per_page',
                'total',
            ]);
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

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.created',
            'entity_type' => 'user',
        ]);
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

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.updated',
            'entity_type' => 'user',
            'entity_id' => (string) $target->id,
        ]);
    }

    public function test_admin_cannot_delete_self(): void
    {
        $admin = $this->actingAsAdmin();

        $response = $this->deleteJson("/api/users/{$admin->id}");
        $response->assertForbidden();
    }

    public function test_admin_delete_user_writes_audit_log(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$target->id}");
        $response->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.deleted',
            'entity_type' => 'user',
            'entity_id' => (string) $target->id,
        ]);
    }

    public function test_admin_can_search_users_by_name_or_email(): void
    {
        $this->actingAsAdmin();
        User::factory()->create([
            'name' => 'Alpha User',
            'email' => 'alpha@example.com',
        ]);
        User::factory()->create([
            'name' => 'Beta User',
            'email' => 'beta@example.com',
        ]);

        $response = $this->getJson('/api/users?search=alpha');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertSame('alpha@example.com', $data[0]['email']);
    }
}
