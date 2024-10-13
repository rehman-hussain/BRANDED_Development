<?php

namespace App\Http\Controllers\SaveToMySQL;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use App\Services\FilemakerAPIService;


class StoreTeamsAndUsers extends Controller
{
    protected $apiService;

    public function __construct(FilemakerAPIService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function storeTeamAndUsers()
    {
        /*
         * Team IDs to process
         * Outsource EKCS = 9
         * Outsource MDS = 10
         * Outsource Amnet = 24
         * Outsource ComartOne = 28
         * Outsource Imaging4U = 34
         * Outsource SGO = 35
         * Outsource Organik = 37
         * Outsource Linked Global = 38
         * Add them 2/3 at a time otherwise will exceed 30 sec time limit
        */

        $teamIds = [28];
        $messages = [];

        foreach ($teamIds as $teamId) {
            // Check if the team exists and is up-to-date
            $team = Team::find($teamId);

            if ($team) {
                if ($team->updated_at && $team->updated_at->gt(now()->subDay())) {
                    // If the team was updated within the last day, skip API call
                    $messages[] = "Team {$team->name} is up-to-date. No update needed.";
                    continue;
                } else {
                    $messages[] = "Team {$team->name} is outdated. Fetching latest data.";
                }
            } else {
                $messages[] = "Team with ID {$teamId} not found in database. Fetching data.";
            }

            // Make API call to get team data
            $teamName = $this->apiService->findTeamNameById($teamId);
            $usersInTeam = $this->apiService->getUsersInTeamByTeamID($teamId);

            // Update or create the team in the database
            $team = Team::updateOrCreate(
                ['id' => $teamId],
                ['name' => $teamName] // 'updated_at' will be automatically managed by Eloquent
            );

            // Store users in the database
            foreach ($usersInTeam as $userData) {
                $sanitizedUsername = str_replace(' ', '', $userData['username']); // Remove spaces from the username

                User::updateOrCreate(
                    ['userid' => $userData['userid']], // Match or create user by userid (a_kp_ID)
                    [
                        'name' => $userData['username'],
                        'team_id' => $team->id,
                        'email' => "{$sanitizedUsername}@example.com", // Provide a default email without spaces
                        'password' => bcrypt('defaultpassword'), // Required password field
                        'capabilities' => $userData['capabilities'] // Store capabilities
                    ]
                );
            }
            $messages[] = "Team $teamName and its users have been updated or stored.";
        }
        return response()->json(['message' => $messages]);
    }
}
