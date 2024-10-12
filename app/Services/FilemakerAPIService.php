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

}
