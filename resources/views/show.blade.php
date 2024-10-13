<!DOCTYPE html>
<html>
<head>
    <title>Timesheet Debug</title>
</head>
<body>
<h1>Timesheet Lines Debug View</h1>

@if ($timesheetLines && count($timesheetLines) > 0)
    <h2>Timesheet Lines ({{ count($timesheetLines) }} records)</h2>

    @foreach ($timesheetLines as $timesheetLine)
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
            <h3>Record Details</h3>
            <pre>{{ print_r($timesheetLine, true) }}</pre>
        </div>
    @endforeach
@else
    <p>No timesheet lines found or there was an error retrieving the data.</p>
@endif

<h3>Full API Response (Raw):</h3>
<pre>{{ print_r($apiResponse, true) }}</pre>
</body>
</html>
