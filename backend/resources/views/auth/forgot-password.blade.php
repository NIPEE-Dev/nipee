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

                    @if (session('status'))
                        <div class="mb-4">
                            <small class="text-success">
                                {{ session('status') }}
                            </small>
                        </div>
                    @endif

                    <x-validation-errors class="my-4"></x-validation-errors>

                    <!-- title-->
                    <h4 class="mt-0">{{ __('recovery.password') }}</h4>
                    <p class="text-muted mb-4">{{ __('recovery.password.instructions') }}</p>

                    <form method="POST" action="{{ route('password.email') }}">
                        @csrf

                        <x-forms.input label="E-mail" type="email" name="email" required autofocus></x-forms.input>

                        <div class="d-grid text-center">
                            <button class="btn btn-primary" type="submit">{{ __('recovery.password.redefine') }}</button>
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
