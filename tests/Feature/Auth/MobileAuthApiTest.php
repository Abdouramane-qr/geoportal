<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\TwoFactorAuthenticationProvider;
use Tests\TestCase;

class MobileAuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_credentials_and_receive_token(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'android-app',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'email', 'profile'],
            ]);
    }

    public function test_login_requires_two_factor_when_enabled(): void
    {
        $user = User::factory()->create();
        $secret = app(TwoFactorAuthenticationProvider::class)->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ])->save();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(202)
            ->assertJsonStructure([
                'message',
                'two_factor_required',
                'challenge_token',
            ])
            ->assertJson([
                'two_factor_required' => true,
            ]);
    }

    public function test_user_can_complete_two_factor_challenge_with_recovery_code(): void
    {
        $user = User::factory()->create();
        $secret = app(TwoFactorAuthenticationProvider::class)->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ])->save();

        $login = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $challengeToken = $login->json('challenge_token');

        $response = $this->postJson('/api/auth/two-factor-challenge', [
            'challenge_token' => $challengeToken,
            'code' => 'recovery-code-1',
            'device_name' => 'ios-app',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'email', 'profile'],
            ]);
    }

    public function test_authenticated_user_can_fetch_profile_and_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('mobile-app')->plainTextToken;

        $meResponse = $this->withToken($token)->getJson('/api/auth/me');
        $meResponse->assertOk()
            ->assertJsonPath('user.id', $user->id);

        $logoutResponse = $this->withToken($token)->postJson('/api/auth/logout');
        $logoutResponse->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
