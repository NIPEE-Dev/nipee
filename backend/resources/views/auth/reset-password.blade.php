<x-guest-layout>
    <div class="auth-fluid">
        <!-- Auth fluid right content -->
        <x-auth.auth-right></x-auth.auth-right>
        <!-- end Auth fluid right content -->

        <!--Auth fluid left content -->
        <div class="auth-fluid-form-box">
            <div class="align-items-center d-flex h-100">
                <div class="card-body">

                    <!-- Logo -->
                    <div class="auth-brand text-center text-lg-start">
                        <div class="auth-logo">
                            <x-auth.logo></x-auth.logo>
                        </div>
                    </div>

                    <x-validation-errors class="my-4"></x-validation-errors>

                    <form method="POST" action="{{ route('password.update') }}">
                        @csrf

                        <input type="hidden" name="token" value="{{ $request->route('token') }}">

                        <x-forms.input label="E-mail" type="email" name="email" value="{{ old('email', $request->email) }}" required autofocus></x-forms.input>
                        <div class="mb-2">
                            <label for="password" class="form-label">{{ __('password') }}</label>
                            <div class="input-group input-group-merge">
                                <input type="password" id="password" name="password" class="form-control" placeholder="Insira sua senha" required autocomplete="new-password">
                                <div class="input-group-text" data-password="false">
                                    <span class="password-eye"></span>
                                </div>
                            </div>
                        </div>

                        <div class="mb-2">
                            <label for="password_confirmation" class="form-label">{{ __('password.insert.confirm') }}</label>
                            <div class="input-group input-group-merge">
                                <input type="password" id="password_confirmation" name="password_confirmation" class="form-control" placeholder="{{ __('password.insert.confirm') }}" required autocomplete="new-password">
                                <div class="input-group-text" data-password="false">
                                    <span class="password-eye"></span>
                                </div>
                            </div>
                        </div>

                        <div class="d-grid text-center">
                            <button class="btn btn-primary" type="submit">{{ __('enter') }}</button>
                        </div>
                    </form>

                    <!-- Footer-->
                    <footer class="footer footer-alt">
                        <p class="text-muted">{{ __('recovery.password.backto.login') }} <a href="{{ route('login') }}" class="text-primary fw-medium ms-1">Login</a></p>
                    </footer>

                </div> <!-- end .card-body -->
            </div> <!-- end .align-items-center.d-flex.h-100-->
        </div>
        <!-- end auth-fluid-form-box-->
    </div>
</x-guest-layout>


{{--<x-guest-layout>
    <x-jet-authentication-card>
        <x-slot name="logo">
            <x-jet-authentication-card-logo />
        </x-slot>

        <x-jet-validation-errors class="mb-4" />

        <form method="POST" action="{{ route('password.update') }}">
            @csrf

            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            <div class="block">
                <x-jet-label for="email" value="{{ __('Email') }}" />
                <x-jet-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email', $request->email)" required autofocus />
            </div>

            <div class="mt-4">
                <x-jet-label for="password" value="{{ __('Password') }}" />
                <x-jet-input id="password" class="block mt-1 w-full" type="password" name="password" required autocomplete="new-password" />
            </div>

            <div class="mt-4">
                <x-jet-label for="password_confirmation" value="{{ __('Confirm Password') }}" />
                <x-jet-input id="password_confirmation" class="block mt-1 w-full" type="password" name="password_confirmation" required autocomplete="new-password" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <x-jet-button>
                    {{ __('Reset Password') }}
                </x-jet-button>
            </div>
        </form>
    </x-jet-authentication-card>
</x-guest-layout>--}}
