<?php

namespace App\Imports;

use App\Models\Unit;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UnitsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Unit([
            'name' => $row['nama'] ?? $row['name'],
            'code' => $row['kode'] ?? $row['code'] ?? null,
            'is_active' => true,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama' => 'required_without:name|string|max:255',
            'name' => 'required_without:nama|string|max:255',
        ];
    }
}
