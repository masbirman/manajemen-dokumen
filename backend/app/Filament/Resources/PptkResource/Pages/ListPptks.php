<?php

namespace App\Filament\Resources\PptkResource\Pages;

use App\Exports\PptkExport;
use App\Exports\PptkTemplateExport;
use App\Filament\Resources\PptkResource;
use App\Imports\PptkImport;
use Filament\Actions;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Facades\Excel;

class ListPptks extends ListRecords
{
    protected static string $resource = PptkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('import')
                ->label('Import')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('success')
                ->form([
                    FileUpload::make('file')
                        ->label('File Excel')
                        ->acceptedFileTypes([
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/vnd.ms-excel',
                            'text/csv',
                        ])
                        ->required()
                        ->helperText('Format: nama_pptk, nip, unit, aktif (Ya/Tidak)')
                        ->directory('temp-imports'),
                ])
                ->action(function (array $data) {
                    try {
                        $filePath = storage_path('app/public/' . $data['file']);
                        Excel::import(new PptkImport, $filePath);
                        
                        Notification::make()
                            ->title('Import berhasil!')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('Import gagal')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            Action::make('downloadTemplate')
                ->label('Template')
                ->icon('heroicon-o-document-arrow-down')
                ->color('gray')
                ->action(function () {
                    return Excel::download(new PptkTemplateExport, 'template-pptk.xlsx');
                }),
            Action::make('export')
                ->label('Export')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('warning')
                ->action(function () {
                    return Excel::download(new PptkExport, 'pptk-' . now()->format('Y-m-d') . '.xlsx');
                }),
            Actions\CreateAction::make(),
        ];
    }
}

