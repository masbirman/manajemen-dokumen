<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('type_id')->constrained('types')->cascadeOnDelete();
            $table->foreignId('pptk_id')->constrained('pptks')->cascadeOnDelete();
            $table->decimal('nilai', 15, 2)->default(0);
            $table->text('uraian')->nullable();
            $table->string('pdf_path')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('records');
    }
};
