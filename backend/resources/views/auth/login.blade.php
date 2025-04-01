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
                    <div class="auth-brand text-center text-lg-start" style="position: initial;">
                        <div class="auth-logo">
                            <x-auth.logo></x-auth.logo>
                        </div>
                    </div>

                    <x-validation-errors class="my-4"></x-validation-errors>

                    <!-- title-->
                    <h4 class="mt-0">{{ __('index.enter') }}</h4>
                    <p class="text-muted mb-4">{{ __('index.enter.text') }}</p>

                    <!-- form -->
                    <form method="POST" action="{{ route('login') }}">
                        @csrf

                        <div class="mb-2">
                            <label for="email" class="form-label">{{ __('email') }}</label>
                            <input id="email" class="form-control" type="email" name="email" value="{{ old('email') }}" required autofocus placeholder="{{ __('email.insert') }}">
                        </div>
                        <div class="mb-2">
                            @if (Route::has('password.request'))
                                <a href="{{ route('password.request') }}" class="text-muted float-end"><small>{{ __('index.miss.password') }}</small></a>
                            @endif
                            <label for="password" class="form-label">Senha</label>
                            <div class="input-group input-group-merge">
                                <input id="password" class="form-control" type="password" name="password" required autocomplete="current-password" placeholder="{{ __('password.insert') }}" />
                                <div class="input-group-text" data-password="false">
                                    <span class="password-eye"></span>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="remember_me">
                                <label class="form-check-label" for="remember_me">
                                    {{ __('index.keep.logged') }}
                                </label>
                            </div>
                        </div>
                        <div class="d-grid text-center">
                            <button class="btn btn-primary" type="submit">{{ __('index.enter') }}</button>
                        </div>
                    </form>
                    <!-- end form-->

                    <!-- Footer-->
                    <footer class="footer footer-alt">

                    </footer>

                </div> <!-- end .card-body -->
            </div> <!-- end .align-items-center.d-flex.h-100-->
        </div>
        <!-- end auth-fluid-form-box-->
    </div>
</x-guest-layout>
