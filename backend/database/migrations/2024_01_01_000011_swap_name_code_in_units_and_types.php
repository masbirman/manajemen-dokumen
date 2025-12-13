<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Swap name and code values in units and types tables.
     */
    public function up(): void
    {
        // Swap name and code in units table
        DB::statement('
            UPDATE units 
            SET name = code, code = name
            WHERE code IS NOT NULL AND code != ""
        ');

        // Swap name and code in types table
        DB::statement('
            UPDATE types 
            SET name = code, code = name
            WHERE code IS NOT NULL AND code != ""
        ');
    }

    /**
     * Reverse the migrations.
     * Swap back name and code values.
     */
    public function down(): void
    {
        // Swap back in units table
        DB::statement('
            UPDATE units 
            SET name = code, code = name
            WHERE code IS NOT NULL AND code != ""
        ');

        // Swap back in types table
        DB::statement('
            UPDATE types 
            SET name = code, code = name
            WHERE code IS NOT NULL AND code != ""
        ');
    }
};
