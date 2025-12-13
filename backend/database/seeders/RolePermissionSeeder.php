<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Dashboard
            'view_dashboard' => 'Akses Dashboard',
            
            // Documents
            'view_documents' => 'Lihat Dokumen',
            'create_documents' => 'Buat Dokumen',
            'edit_documents' => 'Edit Dokumen',
            'delete_documents' => 'Hapus Dokumen',
            
            // Master Data
            'manage_units' => 'Kelola Unit',
            'manage_types' => 'Kelola Jenis Dokumen',
            'manage_pptks' => 'Kelola PPTK',
            'manage_sumber_dana' => 'Kelola Sumber Dana',
            
            // Settings
            'manage_users' => 'Kelola User',
            'manage_roles' => 'Kelola Role & Permission',
            'manage_settings' => 'Kelola Pengaturan',
        ];

        foreach ($permissions as $name => $description) {
            Permission::firstOrCreate(['name' => $name]);
        }

        // Create roles and assign permissions
        
        // Super Admin - full access
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->syncPermissions(Permission::all());

        // Admin - all except role management
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions([
            'view_dashboard',
            'view_documents',
            'create_documents',
            'edit_documents',
            'delete_documents',
            'manage_units',
            'manage_types',
            'manage_pptks',
            'manage_sumber_dana',
            'manage_users',
            'manage_settings',
        ]);

        // Operator - limited access
        $operator = Role::firstOrCreate(['name' => 'Operator']);
        $operator->syncPermissions([
            'view_dashboard',
            'view_documents',
            'create_documents',
            'edit_documents',
        ]);

        // Assign Super Admin role to first user (admin)
        $adminUser = User::where('username', 'admin')->first();
        if ($adminUser) {
            $adminUser->assignRole('Super Admin');
        }
    }
}
