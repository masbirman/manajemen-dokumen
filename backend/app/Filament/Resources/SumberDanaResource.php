<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SumberDanaResource\Pages;
use App\Models\SumberDana;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SumberDanaResource extends Resource
{
    protected static ?string $model = SumberDana::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationGroup = 'Master Data';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = 'Sumber Dana';
    protected static ?string $pluralModelLabel = 'Sumber Dana';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Sumber Dana'),
                Forms\Components\TextInput::make('code')
                    ->maxLength(50)
                    ->unique(ignoreRecord: true)
                    ->label('Kode'),
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
                    ->label('Nama Sumber Dana'),
                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->label('Kode'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Aktif'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
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
            'index' => Pages\ListSumberDanas::route('/'),
            'create' => Pages\CreateSumberDana::route('/create'),
            'edit' => Pages\EditSumberDana::route('/{record}/edit'),
        ];
    }
}
