<?php


namespace App\Services\Dashboard;

use App\Services\FilemakerAPIService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class MyTasksSummaryService
{
    public function getWorkOrderLines(FilemakerAPIService $apiService)
    {
        $user = Auth::user();
        $cacheKey = 'work_order_lines_' . $user->id;

        return Cache::remember($cacheKey, 900, function () use ($user, $apiService) {
            $params = [
                'd_Team' => $user->team_id,
                'd_AssignedTo' => $user->name,
                'Status' => 'With Operator',
            ];

            $workAssignments = $apiService->dashboardCurrentWorkAssignment($params);
            $relatedWorkOrders = [];

            foreach ($workAssignments as $assignment) {
                $lineItemId = $assignment['line_item_id'] ?? null;

                if ($lineItemId) {
                    $workOrderAssignment = $apiService->getWorkOrderLineById($lineItemId);
                    if ($workOrderAssignment) {
                        $relatedWorkOrders[] = $workOrderAssignment;
                    }
                }
            }

            return $relatedWorkOrders;
        });
    }
}
