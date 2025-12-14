<?php

namespace App\Filament\Pages\Auth;

use Filament\Facades\Filament;
use Filament\Http\Responses\Auth\Contracts\LogoutResponse as LogoutResponseContract;

class CustomLogoutResponse implements LogoutResponseContract
{
    public function toResponse($request)
    {
        // Redirect to frontend logout page to clear localStorage
        $frontendUrl = config('app.url', 'http://localhost:3000');
        return redirect($frontendUrl . '/logout');
    }
}
