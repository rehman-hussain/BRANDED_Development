<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class FilemakerAPIService
{
    protected $baseUrl;
    protected $apiUser;
    protected $apiPassword;
    protected $expiresIn;

    public function __construct()
    {
        $this->baseUrl = config('services.api.base_url');
        $this->apiUser = config('services.api.user');
        $this->apiPassword = config('services.api.password');
        $this->expiresIn = env('TOKEN_EXPIRES_IN', 900); // Default to 900 seconds (15 minutes)
    }

    /**
     * Checks the validity of the token and refreshes it if necessary.
     *
     * @param string $tokenType The type of the token to check.
     */
    public function checkToken($tokenType)
    {
        $token = Session::get("lastResponses.$tokenType");
        $now = time();

        // If token is expired or not found, make a new authentication call
        if ($token && $now > $token->expires_on) {
            $this->makeAuthCall($tokenType);
            Log::info("$tokenType Token expired. Generated new token.");
        } elseif ($token) {
            // Extend the token's expiration time
            $token->expires_on = $now + $this->expiresIn;
            Log::info("$tokenType Token extended.");
        } else {
            // No token found, make a new authentication call
            $this->makeAuthCall($tokenType);
            Log::info("$tokenType Token created.");
        }

        // Log the token data for debugging
        Log::info('Session Data:', ['session' => Session::get("lastResponses.$tokenType")]);
    }

    /**
     * Makes an authentication call to retrieve a new token.
     *
     * @param string $tokenType The type of the token to create.
     */
    protected function makeAuthCall($tokenType)
    {
        $url = $tokenType === 'auth/GroupCoreServices' ? 'GroupCoreServices/sessions' : 'Production/sessions';

        // Ensure that the base URL is properly concatenated with the path
        $fullUrl = rtrim($this->baseUrl, '/') . '/' . ltrim($url, '/');
        Log::info('Full URL: ' . $fullUrl);  // Log the full URL for debugging

        // Prepare and send the authentication request
        $requestBody = (object) []; // Empty body
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode("$this->apiUser:$this->apiPassword"),
        ])
        ->withoutVerifying()
        ->post($fullUrl, $requestBody); // Use $fullUrl

        $apiResponse = $response->json();

        // If the response contains a token, store it in the session
        if (isset($apiResponse['response']['token'])) {
            $currentTime = time();
            $tokenData = $apiResponse['response'];
            $tokenData['expires_in'] = $this->expiresIn;
            $tokenData['expires_on'] = $currentTime + $this->expiresIn;
            Session::put("lastResponses.$tokenType", (object) $tokenData);
        } else {
            // Log error if token retrieval fails
            Log::error('Failed to get token', ['response' => $apiResponse]);
        }
    }


    /**
     * Retrieves the current authentication token, refreshing it if needed.
     *
     * @param string $tokenType The type of the token to retrieve.
     * @return string|null The token or null if not found.
     */
    public function getAuthToken($tokenType)
    {
        $this->checkToken($tokenType);

        $sessionData = Session::get("lastResponses.$tokenType");

        if (!$sessionData || !isset($sessionData->token)) {
            Log::error('Token not found in session.');
            return null;
        }

        return $sessionData->token;
    }

    /**
     * Finds the name of a team by its ID using the API.
     *
     * @param int $teamId The ID of the team.
     * @return string The name of the team or 'Token not found' if the token is missing.
     */
    public function findTeamNameById($teamId)
    {
        $token = $this->getAuthToken('auth/GroupCoreServices');

        if (!$token) {
            return 'Token not found';
        }

        $parameters = [
            'query' => [
                ['a_kp_ID' => $teamId]
            ]
        ];

        // Send request to find the team by ID
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])
            ->withoutVerifying()
            ->post($this->baseUrl . '/GroupCoreServices/layouts/' . config('services.api.layout_prefix') . 'Teams/_find', $parameters);

        $apiResponse = $response->json();

        $teamName = '';
        if (isset($apiResponse['messages'][0]['code']) && $apiResponse['messages'][0]['code'] == 0) {
            $responseData = $apiResponse['response']['data'][0]['fieldData'];
            $teamName = $responseData['d_TeamName'] ?? 'Unknown Team';
        }

        return $teamName;
    }

    /**
     * Retrieves the users in a team by the team's ID using the API.
     *
     * @param int $teamId The ID of the team.
     * @return array An array of users in the team.
     */
    public function getUsersInTeamByTeamID($teamId)
    {
        $token = $this->getAuthToken('auth/GroupCoreServices');

        if (!$token) {
            return [];
        }

        $parameters = [
            'query' => [
                ['a_kf_TeamID' => "=$teamId"]
            ]
        ];

        // Send request to get users in the specified team
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])
            ->withoutVerifying()
            ->post($this->baseUrl . '/GroupCoreServices/layouts/' . config('services.api.layout_prefix') . 'Users_Teams_Associations/_find', $parameters);

        $apiResponse = $response->json();

        $usersData = [];
        if (isset($apiResponse['messages'][0]['code']) && $apiResponse['messages'][0]['code'] == 0) {
            foreach ($apiResponse['response']['data'] as $userData) {
                $usersData[] = [
                    'username' => $userData['fieldData']['a_ks_UserName'] ?? 'Unknown User',
                    'capabilities' => $userData['fieldData']['d_Capabilities'] ?? null,
                    'userid' => $userData['fieldData']['a_kp_ID'] ?? null
                ];
            }
        }
        return $usersData;
    }

    /**
     * Retrieves the current work assignments for the dashboard.
     *
     * @param array $params The query parameters for the API call.
     * @param array $sortOptions Optional sort options for the data.
     * @return array|bool The retrieved work assignments or false if failed.
     */
    public function dashboardCurrentWorkAssignment($params)
    {
        // Ensure token is valid
        $token = $this->getAuthToken('auth/Production');

        if (!$token) {
            return false;
        }

        // Build parameters
        $parameters = [
            'query' => [$params],
            'offset' => '1',
            'limit' => '25'
        ];

        // Get layout prefix from the config
        $layoutPrefix = config('services.api.layout_prefix', 'ds_');

        // Construct the layout path
        $layoutPath = '/Production/layouts/' . $layoutPrefix . 'dashboardcurrentworkassignment/_find';

        // Make API call to retrieve work assignments
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])
            ->withoutVerifying()
            ->post($this->baseUrl . $layoutPath, $parameters);

        $apiResponse = $response->json();

        // Check if the API call was successful
        $workAssignments = [];
        if (isset($apiResponse['messages'][0]['code']) && $apiResponse['messages'][0]['code'] == 0) {
            foreach ($apiResponse['response']['data'] as $workData) {
                $workAssignments[] = [
                    'line_item_id' => $workData['fieldData']['a_kf_LineItemID'] ?? null,
                    'due_date' => $workData['fieldData']['d_DueDate'] ?? null,
                    'assigned_to' => $workData['fieldData']['d_AssignedTo'] ?? null,
                    'status' => $workData['fieldData']['Status'] ?? null,
                    'team' => $workData['fieldData']['d_Team'] ?? null,
                    'entry_type' => $workData['fieldData']['d_EntryType'] ?? null,
                ];
            }
        }
        return $workAssignments;
    }

    public function getWorkOrderLineById($id)
    {
        // Ensure token is valid for GroupCoreServices
        $token = $this->getAuthToken('auth/GroupCoreServices');

        if (!$token) {
            Log::error('Token not found for GroupCoreServices.');
            return false;
        }

        // Build parameters to search by ID (the correct field)
        $parameters = [
            'query' => [
                ['ID' => $id]  // We're now searching by the 'ID' field
            ],
            'offset' => '1',
            'limit' => '1'
        ];

        // Log the parameters for debugging
        Log::info('API Request Parameters for Work Order Line by ID', ['parameters' => $parameters]);

        // Get layout prefix from the config (or set default 'ds_')
        $layoutPrefix = config('services.api.layout_prefix', 'ds_');

        // Construct the layout path for WorksOrdersLines
        $layoutPath = '/GroupCoreServices/layouts/' . $layoutPrefix . 'WorksOrdersLines/_find';

        // Make API call to retrieve work order lines based on ID
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])
            ->withoutVerifying()
            ->post($this->baseUrl . $layoutPath, $parameters);

        // Convert API response to array
        $apiResponse = $response->json();

        // Log the full response for debugging
        Log::info('API Response for Work Order Line by ID', ['response' => $apiResponse]);

        // Check if the API call was successful
        if (isset($apiResponse['messages'][0]['code']) && $apiResponse['messages'][0]['code'] == 0) {
            $workData = $apiResponse['response']['data'][0]['fieldData'];
            return [
                'internal_serial_number' => $workData['a_kf_InternalSerialisedNumber'] ?? null,
                'item_reference' => $workData['a_kf_ItemReference'] ?? null,
                'customer_reference' => $workData['d_CustomerReference'] ?? null,
                'item_description' => $workData['d_ItemDescription'] ?? null,
                'category1' => $workData['d_Category1'] ?? null,
                'category2' => $workData['d_Category2'] ?? null,
                'category3' => $workData['d_Category3'] ?? null,
                'studio_status' => $workData['d_StudioStatus'] ?? null,
            ];
        }

        // Log error if the API call fails
        Log::error('Failed to get work order line by ID.', [
            'ID' => $id,
            'apiResponse' => $apiResponse
        ]);

        return false;
    }

    /**
     * Retrieves the timesheet lines assigned to the current user from the Production database.
     *
     * @param string $assignedTo The name of the assigned user.
     * @return array|bool The retrieved timesheet lines or false if failed.
     */
    public function getTimesheetLinesForUser($assignedTo)
    {
        // Log to see if the function is being called
        Log::info('Calling getTimesheetLinesForUser', ['assignedTo' => $assignedTo]);

        // Ensure token is valid for Production
        $token = $this->getAuthToken('auth/Production');

        if (!$token) {
            Log::error('Failed to get token for Production');
            return false;
        }

        // Build query parameters to find records assigned to the current user and where Status is 'With Operator'
        $parameters = [
            'query' => [
                [
                    'd_AssignedTo' => $assignedTo,
                    'Status' => 'With Operator'  // Exact match
                ]
            ],
            'limit' => 100,  // Adjust the limit if necessary
        ];

        // Log the parameters being sent in the API call
        Log::info('API Call Parameters', ['parameters' => json_encode($parameters, JSON_PRETTY_PRINT)]);

        // Construct the layout path for TimesheetLines
        $layoutPath = '/Production/layouts/' . config('services.api.layout_prefix', 'ds_') . 'TimesheetLines/_find';

        // Make API call to retrieve timesheet lines based on assigned user and status
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])
            ->withoutVerifying()
            ->post($this->baseUrl . $layoutPath, $parameters);

        $apiResponse = $response->json();

        // Log the full API response for debugging
        Log::info('API Response', ['response' => json_encode($apiResponse, JSON_PRETTY_PRINT)]);

        // Check if the API call was successful
        if (isset($apiResponse['messages'][0]['code']) && $apiResponse['messages'][0]['code'] == 0) {
            $timesheetLines = [];
            foreach ($apiResponse['response']['data'] as $record) {
                $timesheetLines[] = $record['fieldData']; // Collect all fields from the record
            }

            // Return both timesheetLines and the full API response for further use
            return [
                'timesheetLines' => $timesheetLines,
                'apiResponse' => $apiResponse, // Return the full API response
            ];
        }

        // Log the error if the API call fails
        Log::error('Failed to get timesheet lines for user.', [
            'assignedTo' => $assignedTo,
            'apiResponse' => json_encode($apiResponse, JSON_PRETTY_PRINT)
        ]);

        return false;
    }

}
