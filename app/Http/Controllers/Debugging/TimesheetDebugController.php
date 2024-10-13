<?php

namespace App\Http\Controllers\Debugging;

use App\Http\Controllers\Controller;
use App\Services\FilemakerAPIService;

class TimesheetDebugController extends Controller
{
    /**
     * Show the timesheet lines for debugging purposes.
     *
     * @param FilemakerAPIService $apiService
     * @return \Illuminate\View\View
     */
    public function showTimesheetLines(FilemakerAPIService $apiService)
    {
        // You can change this to dynamically fetch the assigned user if needed
        $assignedTo = "Uma Shankar";

        // Retrieve the timesheet lines using the existing method
        $result = $apiService->getTimesheetLinesForUser($assignedTo);

        // Check if the API call was successful and timesheet lines were retrieved
        if ($result !== false) {
            $timesheetLines = $result['timesheetLines'];
            $apiResponse = $result['apiResponse'];

            // Return both timesheet lines and the full API response for debugging
            return view('show', compact('timesheetLines', 'apiResponse'));
        }

        // If the call failed, return an empty view or an error message
        return view('show', ['timesheetLines' => [], 'apiResponse' => []]);
    }
}
