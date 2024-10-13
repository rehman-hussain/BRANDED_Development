<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\MyTasksStatsService;
use App\Services\Dashboard\MyTasksSummaryService;
use App\Services\FilemakerAPIService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class UserDashboardSummaryController extends Controller
{
    public function index(FilemakerAPIService $apiService, MyTasksStatsService $statsService, MyTasksSummaryService $timesheetLinesService)
    {
        // Get counts and timesheet lines
        $counts = $this->dueDateStats($apiService, $statsService);
        $timesheetLines = $timesheetLinesService->getTimesheetLines($apiService); // Fetch timesheet lines

        // Render the updated Dashboard view located in 'UserDashboard/Dashboard'
        return Inertia::render('UserDashboard/Dashboard', [
            'counts' => $counts,
            'workOrderLines' => $timesheetLines, // Update variable to reflect timesheet lines
        ]);
    }

    public function dueDateStats(FilemakerAPIService $apiService, MyTasksStatsService $statsService)
    {
        $user = Auth::user();
        $cacheKey = 'dashboard_work_assignments_' . $user->id;

        $cacheDuration = config('cache.durations.work_assignment', 900);
        $workAssignments = Cache::remember($cacheKey, $cacheDuration, function () use ($user, $apiService) {
            $params = [
                'd_AssignedTo' => $user->name, // Use the current user's name
                'Status' => 'With Operator',   // Ensure you're filtering by 'With Operator'
            ];

            $assignments = $apiService->dashboardCurrentWorkAssignment($params);

            if ($assignments === false) {
                return [];
            }

            return $assignments;
        });

        $counts = $statsService->calculateDueDateCounts($workAssignments);

        return $counts; // Return only the counts data
    }

}
