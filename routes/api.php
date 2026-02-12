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
Route::get('parcels', [ParcelController::class, 'index']);
Route::get('parcels/{id}', [ParcelController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('parcels', [ParcelController::class, 'store']);
    Route::put('parcels/{id}', [ParcelController::class, 'update']);
    Route::patch('parcels/{id}', [ParcelController::class, 'update']);
    Route::delete('parcels/{id}', [ParcelController::class, 'destroy']);
});
