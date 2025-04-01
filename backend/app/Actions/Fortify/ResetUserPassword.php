<?php

namespace App\Actions\Fortify;

use App\Beans\MailTask;
use App\Jobs\SendMail;
use App\Mail\NewUserMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetUserPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and reset the user's forgotten password.
     *
     * @param  mixed  $user
     * @param  array  $input
     * @return void
     */
    public function reset($user, array $input)
    {
        Validator::make($input, [
            'password' => $this->passwordRules(),
        ])->validate();

        $user->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();

        if(isset($input['new_user']) && $input['new_user'] === true){
            SendMail::dispatch(new MailTask($user->email, new NewUserMail("Welcome!", $input['password'])));
        }
    }
}
