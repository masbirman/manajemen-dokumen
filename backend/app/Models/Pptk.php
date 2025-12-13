<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Pptk extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nip',
        'avatar',
        'unit_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['avatar_url'];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }

    /**
     * Get the avatar URL.
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar 
                ? Storage::url($this->avatar)
                : null,
        );
    }
}

