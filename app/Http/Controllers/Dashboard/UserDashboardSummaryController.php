<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\MyTasksStatsService;
use App\Services\Dashboard\MyTasksSummaryService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserDashboardSummaryController extends Controller
{
    public function index(Request $request, MyTasksStatsService $statsService, MyTasksSummaryService $summaryService)
    {
        // Check if the request wants JSON (for AJAX call)
        if ($request->wantsJson()) {
            $userId = $request->user()->id;

            // Retrieve data from cache
            $cachedData = Cache::get('dashboard_data_' . $userId);

            if ($cachedData) {
                // Return cached data
                return response()->json([
                    'counts' => $cachedData['counts'],
                    'workOrderLines' => $cachedData['workOrderLines'],
                ]);
            } else {
                // Fallback: Fetch data directly if cache is missing
                $counts = $statsService->getDueDateStats();
                $timesheetLines = $summaryService->getTimesheetLines();

                return response()->json([
                    'counts' => $counts,
                    'workOrderLines' => $timesheetLines,
                ]);
            }
        }

        // Initial page load: Return null values for skeleton loading
        return Inertia::render('UserDashboard/Dashboard', [
            'counts' => null,
            'workOrderLines' => null,
        ]);
    }
}

