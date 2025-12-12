<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class PetunjukSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static string $view = 'filament.pages.petunjuk-settings';

    protected static ?string $navigationLabel = 'Petunjuk';

    protected static ?string $title = 'Pengaturan Petunjuk';

    protected static ?string $navigationGroup = 'Pengaturan';

    protected static ?int $navigationSort = 10;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'petunjuk_content' => Setting::get('petunjuk_content', $this->getDefaultContent()),
        ]);
    }

    protected function getDefaultContent(): string
    {
        return '<ul>
            <li>Pilih <strong>Unit</strong> terlebih dahulu</li>
            <li>PPTK akan muncul berdasarkan Unit yang dipilih</li>
            <li>Untuk scan dokumen, buka di perangkat mobile</li>
        </ul>';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Konten Petunjuk')
                    ->description('Konten ini akan ditampilkan di halaman utama frontend')
                    ->schema([
                        RichEditor::make('petunjuk_content')
                            ->label('Isi Petunjuk')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'bulletList',
                                'orderedList',
                                'link',
                                'undo',
                                'redo',
                            ])
                            ->required()
                            ->columnSpanFull(),
                    ]),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('petunjuk_content', $data['petunjuk_content']);

        Notification::make()
            ->title('Berhasil disimpan')
            ->success()
            ->send();
    }
}
