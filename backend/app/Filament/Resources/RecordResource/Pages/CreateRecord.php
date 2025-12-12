<?php

namespace App\Filament\Resources\RecordResource\Pages;

use App\Filament\Resources\RecordResource;
use Filament\Resources\Pages\CreateRecord as BaseCreateRecord;

class CreateRecord extends BaseCreateRecord
{
    protected static string $resource = RecordResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = auth()->id();
        return $data;
    }
}
