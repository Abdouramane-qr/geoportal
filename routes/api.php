<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ParcelController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::post('two-factor-challenge', [AuthController::class, 'twoFactorChallenge'])->middleware('throttle:5,1');
});

Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->apiResource('users', UserController::class);
Route::middleware('auth:sanctum')->get('audit-logs', [AuditLogController::class, 'index']);

Route::get('parcels/geojson', [ParcelController::class, 'geojson']);
Route::get('parcels', [ParcelController::class, 'index']);
Route::get('parcels/{id}', [ParcelController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('parcels', [ParcelController::class, 'store']);
    Route::put('parcels/{id}', [ParcelController::class, 'update']);
    Route::patch('parcels/{id}', [ParcelController::class, 'update']);
    Route::delete('parcels/{id}', [ParcelController::class, 'destroy']);
});
