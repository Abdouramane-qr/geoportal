<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->profile?->role === 'admin';
    }

    public function view(User $user, User $model): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, User $model): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, User $model): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        return $user->id !== $model->id;
    }
}
