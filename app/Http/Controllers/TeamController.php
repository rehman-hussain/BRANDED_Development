<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            ->select('users.*', \DB::raw('MAX(sessions.last_activity) as last_activity')) // Use DB::raw for the aggregate
            ->groupBy('users.id')
            ->get()
            ->map(function ($user) {
                $user->last_activity = $user->last_activity ? (int)$user->last_activity : null;
                return $user;
            });

        return Inertia::render('Team', [
            'users' => $users,
            'teamName' => $teamName,
        ]);
    }
}
