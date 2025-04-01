<?php

namespace App\Traits\Common;

use Illuminate\Support\Facades\Auth;

trait IsAdmin
{
    public function isAdmin()
    {
        $user = Auth::user();
        $roleId = $user->roles[0]->id ?? null;
        if ($roleId === 1) {
            return true;
        }

        return false;
    }
}
