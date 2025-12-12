<?php

namespace App\Filament\Resources\PptkResource\Pages;

use App\Filament\Resources\PptkResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPptk extends EditRecord
{
    protected static string $resource = PptkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
