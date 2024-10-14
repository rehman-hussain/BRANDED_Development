<?php

namespace App\Services\Dashboard;

use App\Services\FilemakerAPIService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class MyTasksStatsService
{
    protected $apiService;

    public function __construct(FilemakerAPIService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Retrieves work assignments and calculates the due date statistics.
     *
     * @return array Due date counts.
     */
    public function getDueDateStats()
    {
        // Retrieve the work assignments
        $workAssignments = $this->getWorkAssignments();

        // Calculate the due date counts
        return $this->calculateDueDateCounts($workAssignments);
    }

    /**
     * Retrieves the work assignments from the cache or API.
     *
     * @return array The list of work assignments.
     */
    protected function getWorkAssignments()
    {
        $user = Auth::user();
        $cacheKey = 'dashboard_work_assignments_' . $user->id;
        $cacheDuration = config('cache.durations.work_assignment', 900);

        return Cache::remember($cacheKey, $cacheDuration, function () use ($user) {
            $params = [
                'd_AssignedTo' => $user->name, // Use the current user's name
                'Status' => 'With Operator',   // Ensure you're filtering by 'With Operator'
            ];

            return $this->apiService->dashboardCurrentWorkAssignment($params) ?? [];
        });
    }

    /**
     * Calculate due date counts for tasks.
     *
     * @param array $workAssignments The work assignments to process.
     * @return array An associative array containing the counts.
     */
    public function calculateDueDateCounts($workAssignments)
    {
        $user = Auth::user();
        $timezone = $user->timezone ?? config('app.timezone', 'UTC');
        $today = Carbon::now($timezone)->startOfDay();
        $tomorrow = Carbon::now($timezone)->addDay()->startOfDay();

        $counts = [
            'overdueCount' => 0,
            'todayCount' => 0,
            'tomorrowCount' => 0,
            'dueLaterCount' => 0,
        ];

        foreach ($workAssignments as $assignment) {
            $dueDate = isset($assignment['due_date']) ? Carbon::parse($assignment['due_date']) : null;

            if ($dueDate) {
                if ($dueDate->lt($today)) {
                    $counts['overdueCount']++;
                } elseif ($dueDate->eq($today)) {
                    $counts['todayCount']++;
                } elseif ($dueDate->eq($tomorrow)) {
                    $counts['tomorrowCount']++;
                } else {
                    $counts['dueLaterCount']++;
                }
            }
        }

        return $counts;
    }
}
