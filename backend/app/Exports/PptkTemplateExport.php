<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PptkTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function array(): array
    {
        // Return sample data rows
        return [
            ['Contoh Nama PPTK', '198501012010011001', 'DINAS-01', 'Ya'],
            ['Nama PPTK Kedua', '', 'DINAS-02', 'Ya'],
        ];
    }

    public function headings(): array
    {
        return [
            'nama_pptk',
            'nip',
            'unit',
            'aktif',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Bold header
        $sheet->getStyle('A1:D1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE0E0E0'],
            ],
        ]);

        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(30);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(10);

        return [];
    }
}
