<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class TokenLoginController extends Controller
{
    /**
     * Auto-login to admin panel using API token
     * This allows seamless SSO from frontend to admin panel
     */
    public function autoLogin(Request $request)
    {
        $token = $request->query('token');
        
        if (!$token) {
            return redirect('/admin/login')->with('error', 'Token tidak ditemukan');
        }

        // Find the token
        $accessToken = PersonalAccessToken::findToken($token);
        
        if (!$accessToken) {
            return redirect('/admin/login')->with('error', 'Token tidak valid');
        }

        // Get the user from token
        $user = $accessToken->tokenable;
        
        if (!$user) {
            return redirect('/admin/login')->with('error', 'User tidak ditemukan');
        }

        // Check if user has admin role
        if (!$user->hasRole(['Admin', 'Super Admin'])) {
            return redirect('/admin/login')->with('error', 'Akses ditolak. Anda bukan admin.');
        }

        // Login the user to web session
        Auth::login($user);

        // Redirect to admin dashboard
        return redirect('/admin');
    }
}
