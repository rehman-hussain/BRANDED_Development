<?php

use App\Http\Controllers\API\FilemakerAPIController;
use App\Http\Controllers\Dashboard\UserDashboardSummaryController;
use App\Http\Controllers\Debugging\TimesheetDebugController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaveToMySQL\StoreTeamsAndUsers;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardSummaryController::class, 'index'])->name('dashboard');
});


Route::get('/task-details', function () {
    return Inertia::render('Tasks/TaskDetails');
})->middleware(['auth'])->name('task.details');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Other routes
Route::get('/test-group-core', [FilemakerAPIController::class, 'testGroupCoreServices']);
Route::get('/test-production', [FilemakerAPIController::class, 'testProduction']);
Route::get('/store-team-and-users', [StoreTeamsAndUsers::class, 'storeTeamAndUsers']);

Route::get('/timesheet-debug', [TimesheetDebugController::class, 'showTimesheetLines'])->name('timesheet.debug');

require __DIR__.'/auth.php';
