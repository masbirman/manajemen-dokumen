<?php

namespace App\Exports;

use App\Models\Pptk;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PptkExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    public function collection()
    {
        return Pptk::with('unit')->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'Nama PPTK',
            'NIP',
            'Unit',
            'Aktif',
        ];
    }

    public function map($pptk): array
    {
        return [
            $pptk->name,
            $pptk->nip ?? '',
            $pptk->unit?->name ?? '',
            $pptk->is_active ? 'Ya' : 'Tidak',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
