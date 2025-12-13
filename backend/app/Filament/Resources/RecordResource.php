<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RecordResource\Pages;
use App\Models\Record;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Number;

class RecordResource extends Resource
{
    protected static ?string $model = Record::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Dokumen';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Dokumen';
    protected static ?string $pluralModelLabel = 'Dokumen';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Utama')
                    ->schema([
                        Forms\Components\Select::make('unit_id')
                            ->relationship('unit', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(fn (Forms\Set $set) => $set('pptk_id', null))
                            ->label('Unit'),
                        Forms\Components\Select::make('type_id')
                            ->relationship('type', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Jenis'),
                        Forms\Components\Select::make('pptk_id')
                            ->relationship(
                                name: 'pptk',
                                titleAttribute: 'name',
                                modifyQueryUsing: fn ($query, Get $get) => 
                                    $query->where('unit_id', $get('unit_id'))
                                          ->where('is_active', true)
                            )
                            ->required()
                            ->searchable()
                            ->preload()
                            ->disabled(fn (Get $get) => !$get('unit_id'))
                            ->label('PPTK'),
                        Forms\Components\TextInput::make('nilai')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->label('Nilai'),
                    ])->columns(2),

                Forms\Components\Section::make('Detail')
                    ->schema([
                        Forms\Components\Textarea::make('uraian')
                            ->rows(4)
                            ->label('Uraian'),
                        Forms\Components\FileUpload::make('pdf_path')
                            ->directory('documents')
                            ->acceptedFileTypes(['application/pdf'])
                            ->maxSize(10240)
                            ->label('File PDF'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable()
                    ->label('No'),
                Tables\Columns\TextColumn::make('unit.name')
                    ->sortable()
                    ->searchable()
                    ->label('Unit'),
                Tables\Columns\TextColumn::make('type.name')
                    ->sortable()
                    ->label('Jenis'),
                Tables\Columns\TextColumn::make('pptk.name')
                    ->sortable()
                    ->searchable()
                    ->label('PPTK'),
                Tables\Columns\TextColumn::make('nilai')
                    ->money('IDR')
                    ->sortable()
                    ->label('Nilai'),
                Tables\Columns\TextColumn::make('uraian')
                    ->limit(50)
                    ->toggleable()
                    ->label('Uraian'),
                Tables\Columns\TextColumn::make('pdf_path')
                    ->label('PDF')
                    ->formatStateUsing(fn ($state) => $state ? '📄 PDF' : '-')
                    ->url(fn ($record) => $record->pdf_url, shouldOpenInNewTab: true)
                    ->color('primary'),
                Tables\Columns\TextColumn::make('creator.name')
                    ->sortable()
                    ->searchable()
                    ->label('Operator')
                    ->default('-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->label('Dibuat'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('unit_id')
                    ->relationship('unit', 'name')
                    ->label('Unit'),
                Tables\Filters\SelectFilter::make('type_id')
                    ->relationship('type', 'name')
                    ->label('Jenis'),
                Tables\Filters\SelectFilter::make('created_by')
                    ->relationship('creator', 'name')
                    ->label('Operator'),
            ])
            ->actions([
                Tables\Actions\Action::make('preview_pdf')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => $record->pdf_url, shouldOpenInNewTab: true)
                    ->visible(fn ($record) => $record->pdf_path !== null)
                    ->color('info'),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRecords::route('/'),
            'create' => Pages\CreateRecord::route('/create'),
            'view' => Pages\ViewRecord::route('/{record}'),
            'edit' => Pages\EditRecord::route('/{record}/edit'),
        ];
    }
}
