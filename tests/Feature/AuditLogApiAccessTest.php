<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogApiAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_audit_logs_api(): void
    {
        $this->getJson('/api/audit-logs')->assertUnauthorized();
    }

    public function test_non_admin_cannot_access_audit_logs_api(): void
    {
        $user = User::factory()->create();
        $user->profile()->update(['role' => 'agronome']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/audit-logs')
            ->assertForbidden();
    }

    public function test_admin_can_access_audit_logs_api_with_filters(): void
    {
        $admin = User::factory()->create();
        $admin->profile()->update(['role' => 'admin']);

        AuditLog::create([
            'actor_user_id' => $admin->id,
            'action' => 'user.created',
            'entity_type' => 'user',
            'entity_id' => '1',
            'metadata' => ['email' => 'a@example.com'],
        ]);

        AuditLog::create([
            'actor_user_id' => $admin->id,
            'action' => 'user.deleted',
            'entity_type' => 'user',
            'entity_id' => '2',
            'metadata' => ['email' => 'b@example.com'],
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/audit-logs?action=user.created&entity_type=user')
            ->assertOk()
            ->assertJsonPath('data.0.action', 'user.created')
            ->assertJsonCount(1, 'data');
    }
}
