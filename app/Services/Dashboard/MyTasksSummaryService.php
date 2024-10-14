<?php

namespace App\Services\Dashboard;

use App\Services\FilemakerAPIService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class MyTasksSummaryService
{
    protected $apiService;

    public function __construct(FilemakerAPIService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Retrieves and caches timesheet lines for the authenticated user.
     *
     * @return array The timesheet lines data.
     */
    public function getTimesheetLines()
    {
        $user = Auth::user();
        $cacheKey = 'timesheet_lines_' . $user->id;

        return Cache::remember($cacheKey, 900, function () use ($user) {
            // Fetch the timesheet lines using the Filemaker API service
            $timesheetLinesResponse = $this->apiService->getTimesheetLinesForUser($user->name);

            // Ensure that timesheetLines is available in the response
            if (!$timesheetLinesResponse || !isset($timesheetLinesResponse['timesheetLines'])) {
                return [];
            }

            // Map only the relevant fields you need for the table
            return collect($timesheetLinesResponse['timesheetLines'])->map(function ($line) {
                return [
                    'a_kf_ItemReference' => $line['TimesheetsLines_WorksOrdersLines::a_kf_ItemReference'] ?? null,
                    'd_Description' => $line['d_Description'] ?? null,
                    'd_EntryType' => $line['d_EntryType'] ?? null,
                    'd_Priority' => $line['d_Priority'] ?? null,
                    'Status' => $line['Status'] ?? null,
                ];
            })->toArray();
        });
    }
}

