<?php

namespace App\Services\Users;

use App\Beans\MailTask;
use App\Jobs\SendMail;
use App\Mail\NewUserMail;
use App\Models\SchoolMember;
use App\Models\Users\User;
use App\Traits\Common\Filterable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersServices
{
    use Filterable;

    public function index($criterias)
    {
        return $this->applyCriteria(User::query(), $criterias)->paginate(Arr::get($criterias, 'perPage', 10));
    }

    public function store($data)
    {
        $password = $data['password'] ?? Str::random(6);
        $data['password'] = Hash::make($password);
        $data['commission'] ??= 0;

        if (isset($data['school_id'])) {
            $data['role_id'] = 10; 
        }

        return tap(
            User::create($data), 
            function (User $user) use ($data, $password) {
                
                if (isset($data['school_id'])) {
                    SchoolMember::create([ 'user_id' => $user->id, 'school_id' => $data['school_id'] ]);
                }
                
                if (isset($data['role'])) {
                    $user->roles()->attach($data['role']); 
                }
                
                SendMail::dispatch(new MailTask($user->email, new NewUserMail("Bem vindo!", $password)));
            }
        );
    }
}