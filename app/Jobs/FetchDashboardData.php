<?php

namespace App\Jobs;

use App\Services\Dashboard\MyTasksStatsService;
use App\Services\Dashboard\MyTasksSummaryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class FetchDashboardData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;

    /**
     * Create a new job instance.
     *
     * @param int $userId
     */
    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param MyTasksStatsService $statsService
     * @param MyTasksSummaryService $summaryService
     * @return void
     */
    public function handle(MyTasksStatsService $statsService, MyTasksSummaryService $summaryService)
    {
        // Set the user context using the ID passed in
        $user = Auth::loginUsingId($this->userId);

        // Fetch and cache due date stats
        $statsService->getDueDateStats();

        // Fetch and cache timesheet lines
        $summaryService->getTimesheetLines();

        // Job finished successfully
    }
}
