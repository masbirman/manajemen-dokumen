<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('unit_id')->nullable()->after('avatar')->constrained('units')->nullOnDelete();
            $table->foreignId('pptk_id')->nullable()->after('unit_id')->constrained('pptks')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropForeign(['pptk_id']);
            $table->dropColumn(['unit_id', 'pptk_id']);
        });
    }
};
