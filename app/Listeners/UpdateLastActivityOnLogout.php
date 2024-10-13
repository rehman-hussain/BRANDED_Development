<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UpdateLastActivityOnLogout
{
    /**
     * Handle the event.
     *
     * @param  \Illuminate\Auth\Events\Logout  $event
     * @return void
     */
    public function handle(Logout $event)
    {
        $user = $event->user;

        if ($user) {
            // Update the last_activity field to the current time in UTC
            $user->last_activity = Carbon::now('UTC');
            $user->save();
        }
    }
}

