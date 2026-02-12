<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ParcelController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:6,1')->prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('two-factor-challenge', [AuthController::class, 'twoFactorChallenge']);
});

Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->apiResource('users', UserController::class);

Route::get('parcels/geojson', [ParcelController::class, 'geojson']);
Route::apiResource('parcels', ParcelController::class);
