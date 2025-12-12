<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OptionController;
use App\Http\Controllers\Api\RecordController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Get dropdown options (public for form)
Route::get('/options', [OptionController::class, 'index']);
Route::get('/pptks-by-unit/{unit}', [OptionController::class, 'pptksByUnit']);
Route::get('/petunjuk', [OptionController::class, 'petunjuk']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Records CRUD
    Route::apiResource('records', RecordController::class);
});
