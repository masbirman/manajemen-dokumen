<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PptkResource\Pages;
use App\Models\Pptk;
use App\Models\Unit;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PptkResource extends Resource
{
    protected static ?string $model = Pptk::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Master Data';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'PPTK';
    protected static ?string $pluralModelLabel = 'PPTK';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('unit_id')
                    ->relationship('unit', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Unit'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama PPTK'),
                Forms\Components\TextInput::make('nip')
                    ->maxLength(50)
                    ->label('NIP'),
                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->label('Aktif'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Nama PPTK'),
                Tables\Columns\TextColumn::make('nip')
                    ->searchable()
                    ->label('NIP'),
                Tables\Columns\TextColumn::make('unit.name')
                    ->sortable()
                    ->label('Unit'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Aktif'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('unit_id')
                    ->relationship('unit', 'name')
                    ->label('Unit'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status Aktif'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPptks::route('/'),
            'create' => Pages\CreatePptk::route('/create'),
            'edit' => Pages\EditPptk::route('/{record}/edit'),
        ];
    }
}
