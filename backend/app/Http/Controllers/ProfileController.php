<?php

namespace App\Http\Controllers;

use App\Services\Permissions\RoleTreeService;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

/**
 * Class ProfileController
 * @package App\Http\Controllers
 */
class ProfileController extends Controller
{
    /**
     * Show the user profile screen.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request, RoleTreeService $menuService)
    {
        return view('profile.index', [
            'request' => $request,
            'user' => $request->user(),
            'permissions' => $menuService->build()
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse|\Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateProfilePhoto(Request $request)
    {
        Validator::make($request->all(), [
            'photo' => ['required', 'mimes:jpg,jpeg,png', 'max:1024'],
        ])->validate();

        $request->user()->updateProfilePhoto($request->file('photo'));

        return $request->wantsJson()
            ? new JsonResponse('', 200)
            : back()->with('status', 'profile-information-updated');
    }

    /**
     * @param StatefulGuard $guard
     * @param Request $request
     */
    public function logoutOtherBrowserSessions(StatefulGuard $guard, Request $request)
    {
        if (!Hash::check($request->post('password'), Auth::user()->password)) {
            throw ValidationException::withMessages([
                'password' => [__('This password does not match our records.')],
            ]);
        }

        $guard->logoutOtherDevices($request->post('password'));

        $this->deleteOtherSessionRecords();
    }

    /**
     * Delete the other browser session records from storage.
     *
     * @return void
     */
    protected function deleteOtherSessionRecords()
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        DB::connection(config('session.connection'))->table(config('session.table', 'sessions'))
            ->where('user_id', Auth::user()->getAuthIdentifier())
            ->where('id', '!=', request()->session()->getId())
            ->delete();
    }
}
