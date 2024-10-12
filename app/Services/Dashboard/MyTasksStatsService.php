<?php
namespace App\Services\Dashboard;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MyTasksStatsService
{
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
