<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\Pptk;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Manajemen User';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi User')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->label('Nama'),
                        Forms\Components\TextInput::make('username')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->alphaDash()
                            ->label('Username')
                            ->helperText('Huruf, angka, dash, underscore'),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->label('Email'),
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : null)
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->minLength(8)
                            ->label('Password')
                            ->helperText('Kosongkan jika tidak ingin mengubah password'),
                    ])->columns(2),

                Forms\Components\Section::make('Role & Avatar')
                    ->schema([
                        Forms\Components\Select::make('roles')
                            ->relationship('roles', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->label('Role')
                            ->helperText('Pilih role untuk user ini')
                            ->live()
                            ->afterStateUpdated(function (Set $set) {
                                $set('unit_id', null);
                                $set('pptk_id', null);
                            }),
                        Forms\Components\FileUpload::make('avatar')
                            ->image()
                            ->avatar()
                            ->imageEditor()
                            ->directory('avatars')
                            ->label('Foto Profil'),
                    ])->columns(2),

                Forms\Components\Section::make('Penugasan Operator')
                    ->schema([
                        Forms\Components\Select::make('unit_id')
                            ->relationship('unit', 'name')
                            ->searchable()
                            ->preload()
                            ->label('Unit')
                            ->helperText('Pilih unit untuk operator')
                            ->live()
                            ->afterStateUpdated(fn (Set $set) => $set('pptk_id', null)),
                        Forms\Components\Select::make('pptk_id')
                            ->label('PPTK')
                            ->options(function (Get $get) {
                                $unitId = $get('unit_id');
                                if (!$unitId) {
                                    return [];
                                }
                                return Pptk::where('unit_id', $unitId)
                                    ->where('is_active', true)
                                    ->pluck('name', 'id');
                            })
                            ->searchable()
                            ->helperText('Pilih PPTK untuk operator (berdasarkan unit yang dipilih)'),
                    ])
                    ->columns(2)
                    ->visible(function (Get $get) {
                        $roles = $get('roles') ?? [];
                        if (empty($roles)) {
                            return false;
                        }
                        // Get role IDs that are Operator
                        $operatorRole = Role::where('name', 'Operator')->first();
                        if (!$operatorRole) {
                            return false;
                        }
                        // Convert to integers for comparison
                        $roleIds = array_map('intval', (array) $roles);
                        return in_array((int) $operatorRole->id, $roleIds);
                    }),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->circular()
                    ->label('Avatar'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Nama'),
                Tables\Columns\TextColumn::make('username')
                    ->searchable()
                    ->sortable()
                    ->label('Username'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->label('Email'),
                Tables\Columns\TextColumn::make('roles.name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Super Admin' => 'danger',
                        'Admin' => 'warning',
                        'Operator' => 'success',
                        default => 'gray',
                    })
                    ->label('Role'),
                Tables\Columns\TextColumn::make('unit.name')
                    ->label('Unit')
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('pptk.name')
                    ->label('PPTK')
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->label('Dibuat'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('roles')
                    ->relationship('roles', 'name')
                    ->label('Role'),
            ])
            ->actions([
                Tables\Actions\Action::make('resetPassword')
                    ->label('Reset Password')
                    ->icon('heroicon-o-key')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Reset Password')
                    ->modalDescription('Password akan di-reset ke password acak dan ditampilkan sekali. Pastikan untuk menyalin password baru.')
                    ->action(function (User $record) {
                        $newPassword = Str::random(12);
                        $record->update(['password' => Hash::make($newPassword)]);
                        
                        Notification::make()
                            ->title('Password berhasil di-reset')
                            ->body("Password baru: **{$newPassword}**")
                            ->success()
                            ->persistent()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (User $record) {
                        if (User::count() <= 1) {
                            throw new \Exception('Tidak dapat menghapus user terakhir');
                        }
                        if ($record->hasRole('Super Admin') && User::role('Super Admin')->count() <= 1) {
                            throw new \Exception('Tidak dapat menghapus Super Admin terakhir');
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}

