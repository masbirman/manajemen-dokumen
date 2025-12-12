<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Record extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'type_id',
        'pptk_id',
        'nilai',
        'uraian',
        'pdf_path',
        'created_by',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
    ];

    protected $appends = ['pdf_url'];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function pptk(): BelongsTo
    {
        return $this->belongsTo(Pptk::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getPdfUrlAttribute(): ?string
    {
        if (!$this->pdf_path) {
            return null;
        }
        return asset('storage/' . $this->pdf_path);
    }
}
