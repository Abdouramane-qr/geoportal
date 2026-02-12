<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsersPageAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_users_page(): void
    {
        $response = $this->get('/utilisateurs');

        $response->assertRedirect(route('login'));
    }

    public function test_non_admin_user_is_forbidden_on_users_page(): void
    {
        $user = User::factory()->create();
        $user->profile()->update(['role' => 'agronome']);

        $response = $this->actingAs($user)->get('/utilisateurs');

        $response->assertForbidden();
    }

    public function test_admin_can_access_users_page(): void
    {
        $admin = User::factory()->create();
        $admin->profile()->update(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/utilisateurs');

        $response->assertOk();
    }
}
