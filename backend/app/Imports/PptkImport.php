<?php

namespace App\Imports;

use App\Models\Pptk;
use App\Models\Unit;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class PptkImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        // Find unit by name
        $unit = Unit::where('name', $row['unit'])->first();
        
        if (!$unit) {
            return null;
        }

        // Check if PPTK with same name and unit exists
        $existingPptk = Pptk::where('name', $row['nama_pptk'])
            ->where('unit_id', $unit->id)
            ->first();

        if ($existingPptk) {
            // Update existing
            $existingPptk->update([
                'nip' => $row['nip'] ?? null,
                'is_active' => $this->parseBoolean($row['aktif'] ?? true),
            ]);
            return null;
        }

        return new Pptk([
            'name' => $row['nama_pptk'],
            'nip' => $row['nip'] ?? null,
            'unit_id' => $unit->id,
            'is_active' => $this->parseBoolean($row['aktif'] ?? true),
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_pptk' => 'required|string|max:255',
            'unit' => 'required|string|exists:units,name',
        ];
    }

    private function parseBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        
        $value = strtolower(trim((string) $value));
        return in_array($value, ['yes', 'ya', 'true', '1', 'aktif', 'active']);
    }
}
