<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'role',
    ];

    protected $keyType = 'string';

    public $incrementing = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::creating(function (self $profile): void {
            if (! $profile->id) {
                $profile->id = (string) Str::uuid();
            }
        });
    }
}
