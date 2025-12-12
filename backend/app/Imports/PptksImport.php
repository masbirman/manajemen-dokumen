<?php

namespace App\Imports;

use App\Models\Pptk;
use App\Models\Unit;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class PptksImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        // Find unit by name or code
        $unitName = $row['unit'] ?? $row['unit_name'] ?? null;
        $unit = Unit::where('name', $unitName)
                    ->orWhere('code', $unitName)
                    ->first();

        if (!$unit) {
            return null; // Skip if unit not found
        }

        return new Pptk([
            'name' => $row['nama'] ?? $row['name'],
            'nip' => $row['nip'] ?? null,
            'unit_id' => $unit->id,
            'is_active' => true,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama' => 'required_without:name|string|max:255',
            'name' => 'required_without:nama|string|max:255',
            'unit' => 'required_without:unit_name|string',
            'unit_name' => 'required_without:unit|string',
        ];
    }
}
