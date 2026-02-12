<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackofficeAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_import_page(): void
    {
        $this->get('/import')->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_from_audit_page(): void
    {
        $this->get('/journal-audit')->assertRedirect(route('login'));
    }

    public function test_non_admin_is_forbidden_on_audit_page(): void
    {
        $user = User::factory()->create();
        $user->profile()->update(['role' => 'agronome']);

        $this->actingAs($user)->get('/journal-audit')->assertForbidden();
    }

    public function test_admin_can_access_audit_page(): void
    {
        $admin = User::factory()->create();
        $admin->profile()->update(['role' => 'admin']);

        $this->actingAs($admin)->get('/journal-audit')->assertOk();
    }
}
