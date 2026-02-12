<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticationProvider;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Identifiants invalides.',
            ], 422);
        }

        if ($user->hasEnabledTwoFactorAuthentication()) {
            $challengeToken = Str::random(64);
            Cache::put($this->challengeCacheKey($challengeToken), $user->id, now()->addMinutes(5));

            return response()->json([
                'message' => 'Authentification à deux facteurs requise.',
                'two_factor_required' => true,
                'challenge_token' => $challengeToken,
            ], 202);
        }

        $token = $user->createToken($validated['device_name'] ?? 'mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile'),
        ]);
    }

    public function twoFactorChallenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_token' => ['required', 'string'],
            'code' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $userId = Cache::get($this->challengeCacheKey($validated['challenge_token']));

        if (! $userId) {
            return response()->json([
                'message' => 'Challenge 2FA invalide ou expiré.',
            ], 422);
        }

        /** @var User|null $user */
        $user = User::find($userId);

        if (! $user || ! $user->hasEnabledTwoFactorAuthentication()) {
            Cache::forget($this->challengeCacheKey($validated['challenge_token']));

            return response()->json([
                'message' => 'Utilisateur introuvable pour ce challenge.',
            ], 422);
        }

        $isRecoveryCode = collect($user->recoveryCodes())->first(
            fn (string $recoveryCode) => hash_equals($recoveryCode, $validated['code'])
        );

        $isValidOtp = app(TwoFactorAuthenticationProvider::class)->verify(
            decrypt($user->two_factor_secret),
            $validated['code']
        );

        if (! $isRecoveryCode && ! $isValidOtp) {
            return response()->json([
                'message' => 'Code 2FA invalide.',
            ], 422);
        }

        if ($isRecoveryCode) {
            $user->replaceRecoveryCode($validated['code']);
        }

        Cache::forget($this->challengeCacheKey($validated['challenge_token']));

        $token = $user->createToken($validated['device_name'] ?? 'mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile'),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('profile'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Déconnecté.',
        ]);
    }

    private function challengeCacheKey(string $challengeToken): string
    {
        return "mobile-auth:2fa:{$challengeToken}";
    }
}
