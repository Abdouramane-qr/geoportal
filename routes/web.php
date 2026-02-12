<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ParcelController;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/carte', fn () => Inertia::render('Index'))->name('carte');

Route::middleware(['auth', 'verified'])->get('/dashboard', fn () => Inertia::render('dashboard'))
    ->name('dashboard');

Route::get('/import', fn () => Inertia::render('ImportPage'));
Route::get('/validation', fn () => Inertia::render('ValidationPage'));
Route::get('/alertes', fn () => Inertia::render('AlertsPage'));
Route::get('/autorites', fn () => Inertia::render('AuthorityDashboard'));
Route::get('/regles-foncieres', fn () => Inertia::render('LandRulesPage'));
Route::get('/utilisateurs', fn () => Inertia::render('UsersPage'));
Route::get('/journal-audit', fn () => Inertia::render('AuditLogPage'));
Route::get('/design-system', fn () => Inertia::render('DesignSystemPage'));
Route::middleware(['auth'])->patch('/parcels/{id}/status', [ParcelController::class, 'updateStatus']);

Route::fallback(function () {
    return Inertia::render('NotFound')->toResponse(request())->setStatusCode(404);
});

require __DIR__.'/settings.php';
