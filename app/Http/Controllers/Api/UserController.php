<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $search = $validated['search'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $query = User::query()
            ->with('profile')
            ->orderBy('id');

        if ($search) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    public function show(Request $request, User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json($user->load('profile'));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults()],
            'role' => ['required', 'in:admin,agronome,autorite'],
            'full_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $user->profile()->update([
            'role' => $data['role'],
            'full_name' => $data['full_name'] ?? $data['name'],
        ]);

        AuditLog::create([
            'actor_user_id' => $request->user()?->id,
            'action' => 'user.created',
            'entity_type' => 'user',
            'entity_id' => (string) $user->id,
            'metadata' => [
                'email' => $user->email,
                'role' => $user->profile?->role,
            ],
        ]);

        return response()->json($user->load('profile'), 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', "unique:users,email,{$user->id}"],
            'password' => ['sometimes', 'required', 'string', Password::defaults()],
            'role' => ['sometimes', 'required', 'in:admin,agronome,autorite'],
            'full_name' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $user->fill(collect($data)->only(['name', 'email', 'password'])->toArray());
        $user->save();

        $profileData = collect($data)->only(['role', 'full_name'])->toArray();
        if (! empty($profileData)) {
            $user->profile()->update($profileData);
        }

        AuditLog::create([
            'actor_user_id' => $request->user()?->id,
            'action' => 'user.updated',
            'entity_type' => 'user',
            'entity_id' => (string) $user->id,
            'metadata' => [
                'fields' => array_keys($data),
            ],
        ]);

        return response()->json($user->load('profile'));
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $targetUserId = (string) $user->id;
        $targetEmail = $user->email;
        $user->delete();

        AuditLog::create([
            'actor_user_id' => $request->user()?->id,
            'action' => 'user.deleted',
            'entity_type' => 'user',
            'entity_id' => $targetUserId,
            'metadata' => [
                'email' => $targetEmail,
            ],
        ]);

        return response()->json(['deleted' => true]);
    }
}
