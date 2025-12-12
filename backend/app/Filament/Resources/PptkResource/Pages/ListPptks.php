<?php

namespace App\Filament\Resources\PptkResource\Pages;

use App\Filament\Resources\PptkResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPptks extends ListRecords
{
    protected static string $resource = PptkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
