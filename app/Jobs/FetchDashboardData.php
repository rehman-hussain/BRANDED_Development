<?php

namespace App\Jobs;

use App\Services\Dashboard\MyTasksStatsService;
use App\Services\Dashboard\MyTasksSummaryService;
use App\Services\FilemakerAPIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class FetchDashboardData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function handle(FilemakerAPIService $apiService, MyTasksStatsService $statsService, MyTasksSummaryService $summaryService)
    {
        // Ensure the user is found before continuing
        $user = User::find($this->userId);

        if (!$user) {
            Log::error("User with ID {$this->userId} not found.");
            return; // Exit if the user is not found
        }

        // Retrieve work assignments
        $params = [
            'd_Team' => $user->team_id,
            'd_AssignedTo' => $user->name,
            'Status' => 'With Operator',
        ];

        $assignments = $apiService->dashboardCurrentWorkAssignment($params);
        if ($assignments === false) {
            Log::error("Failed to retrieve assignments for user ID {$user->id}.");
            return; // Handle failure (log error, etc.)
        }

        // Calculate counts
        $counts = $statsService->calculateDueDateCounts($assignments);

        // Cache counts and workOrderLines
        Cache::put('dashboard_work_assignments_' . $user->id, $counts, 900); // 15 minutes
        Cache::put('work_order_lines_' . $user->id, $summaryService->getWorkOrderLines($apiService, $user), 900);
    }
}
