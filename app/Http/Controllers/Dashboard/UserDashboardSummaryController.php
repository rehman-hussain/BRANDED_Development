<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\MyTasksStatsService;
use App\Services\Dashboard\MyTasksSummaryService;
use Inertia\Inertia;

class UserDashboardSummaryController extends Controller
{
    public function index(MyTasksStatsService $statsService, MyTasksSummaryService $summaryService)
    {
        $counts = $statsService->getDueDateStats(); // Fetch counts
        $timesheetLines = $summaryService->getTimesheetLines(); // Fetch timesheet lines

        return Inertia::render('UserDashboard/Dashboard', [
            'counts' => $counts,
            'workOrderLines' => $timesheetLines,
        ]);
    }
}
