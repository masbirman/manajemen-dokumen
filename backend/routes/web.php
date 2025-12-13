<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TokenLoginController;

Route::get('/', function () {
    return view('welcome');
});

// Auto-login route for SSO from frontend to admin panel
Route::get('/auto-login', [TokenLoginController::class, 'autoLogin']);
