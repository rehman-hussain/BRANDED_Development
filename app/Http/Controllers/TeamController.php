<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TeamController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();

        // Ensure the user belongs to a team
        if (!$authUser->team) {
            return redirect()->back()->withErrors('You are not part of a team.');
        }

        // Fetch the team name
        $teamName = $authUser->team->name;

        // Fetch users who belong to the same team as the authenticated user
        $users = User::where('team_id', $authUser->team_id)
            ->leftJoin('sessions', 'users.id', '=', 'sessions.user_id')
            ->select('users.*', \DB::raw('MAX(sessions.last_activity) as session_last_activity'))
            ->groupBy('users.id')
            ->get()
            ->map(function ($user) use ($authUser) {
                // Handle for logged-in user
                if ($user->id === $authUser->id) {
                    $user->last_activity = Carbon::now('UTC'); // Set current time for the logged-in user in UTC
                } else {
                    // Use session last_activity if available, otherwise fallback to the users table last_activity
                    $sessionLastActivity = $user->session_last_activity ? Carbon::createFromTimestamp($user->session_last_activity) : null;

                    if ($sessionLastActivity) {
                        $user->last_activity = $sessionLastActivity;
                    } elseif ($user->last_activity) {
                        $user->last_activity = Carbon::parse($user->last_activity);
                    } else {
                        $user->last_activity = null;
                    }
                }

                // Determine if the user is online (grace period of 15 minutes)
                $user->is_online = $user->last_activity && $user->last_activity->gt(Carbon::now('UTC')->subMinutes(15));

                // Use Carbon's diffForHumans() to show a relative last seen time
                $user->last_seen_human = $user->last_activity ? $user->last_activity->diffForHumans() : 'N/A';

                return $user;
            });

        return Inertia::render('UserDashboard/Team', [
            'users' => $users,
            'teamName' => $teamName,
        ]);
    }
}
