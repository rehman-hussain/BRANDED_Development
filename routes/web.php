<?php

use App\Http\Controllers\API\FilemakerAPIController;
use App\Http\Controllers\Dashboard\UserDashboardSummaryController;
use App\Http\Controllers\Debugging\TimesheetDebugController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaveToMySQL\StoreTeamsAndUsers;
use App\Http\Controllers\TeamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authenticated routes for USERS with 'auth' middleware
Route::middleware('auth')->group(function () {
    // Dashboard (also requires 'verified')
    Route::middleware('verified')->group(function () {
        Route::get('/dashboard', [UserDashboardSummaryController::class, 'index'])->name('dashboard');
        Route::get('/team', [TeamController::class, 'index'])->name('team.index');
    });

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Task details
    Route::get('/task-details', function () {
        return Inertia::render('Tasks/TaskDetails');
    })->name('task.details');
});

// Other routes
Route::get('/test-group-core', [FilemakerAPIController::class, 'testGroupCoreServices']);
Route::get('/test-production', [FilemakerAPIController::class, 'testProduction']);
Route::get('/store-team-and-users', [StoreTeamsAndUsers::class, 'storeTeamAndUsers']);
Route::get('/timesheet-debug', [TimesheetDebugController::class, 'showTimesheetLines'])->name('timesheet.debug');

// Auth routes
require __DIR__.'/auth.php';
