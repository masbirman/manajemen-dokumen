<?php

namespace App\Filament\Resources\PptkResource\Pages;

use App\Filament\Resources\PptkResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePptk extends CreateRecord
{
    protected static string $resource = PptkResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
