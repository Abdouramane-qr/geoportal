<?php

use App\Http\Controllers\ParcelController;
use Illuminate\Support\Facades\Route;

Route::get('parcels/geojson', [ParcelController::class, 'geojson']);
Route::apiResource('parcels', ParcelController::class);
