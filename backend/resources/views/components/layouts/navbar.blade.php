<div class="navbar-custom">
    <div class="container-fluid">
        <ul class="list-unstyled topnav-menu float-end mb-0">
            <li class="dropdown">
                <a class="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="fullscreen" href="#">
                    <i class="fe-maximize noti-icon"></i>
                </a>
            </li>

            <li class="dropdown d-none d-lg-inline-block topbar-dropdown">
                <a class="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                    <img src="{{ asset('images/flags/' . App::getLocale() . '.jpg') }}" alt="user-image" height="14">
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <!-- item-->
                    <a href="{{ url()->current() }}?lang=pt" class="dropdown-item">
                        <img src="{{ asset('images/flags/pt.jpg') }}" width="18" alt="user-image" class="me-1" height="12"> <span class="align-middle">Português</span>
                    </a>

                    <!-- item-->
                    <a href="{{ url()->current() }}?lang=pt_BR" class="dropdown-item">
                        <img src="{{ asset('images/flags/pt_BR.jpg') }}" alt="user-image" class="me-1" height="12"> <span class="align-middle">Português (Brasil)</span>
                    </a>

                    <!-- item-->
                    <a href="{{ url()->current() }}?lang=es" class="dropdown-item">
                        <img src="{{ asset('images/flags/es.jpg') }}" alt="user-image" class="me-1" height="12"> <span class="align-middle">Español</span>
                    </a>

                    <!-- item-->
                    <a href="{{ url()->current() }}?lang=en" class="dropdown-item">
                        <img src="{{ asset('images/flags/en.jpg') }}" alt="user-image" class="me-1" height="12"> <span class="align-middle">English</span>
                    </a>

                    <!-- item-->
                    <a href="{{ url()->current() }}?lang=fr" class="dropdown-item">
                        <img src="{{ asset('images/flags/fr.jpg') }}" alt="user-image" class="me-1" height="12"> <span class="align-middle">French</span>
                    </a>
                </div>
            </li>

            <li class="dropdown notification-list topbar-dropdown">
                <a class="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                    <img onerror="this.src='{{ asset('images/users/avatar-example.png') }}'"
                         src="{{ asset(auth()->user()->profile_photo_path ? 'storage/' . auth()->user()->profile_photo_path : 'images/users/avatar-example.png') }}"
                         alt="user-image" class="rounded-circle" id="navbar-profile-image">
                    <span class="pro-user-name ms-1">
                    {{ auth()->user()->name }} <i class="mdi mdi-chevron-down"></i>
                </span>
                </a>
                <div class="dropdown-menu dropdown-menu-end profile-dropdown ">
                    <!-- item-->
                    <div class="dropdown-header noti-title">
                        <h6 class="text-overflow m-0">{{ __('welcome') }}</h6>
                    </div>

                    <!-- item-->
                    <a href="{{ route('profile.show') }}" class="dropdown-item notify-item">
                        <i class="ri-account-circle-line"></i>
                        <span>{{ __('my.profile') }}</span>
                    </a>

                    <div class="dropdown-divider"></div>

                    <!-- item-->
                    <form method="POST" action="{{ url('logout') }}">
                        @csrf

                        <button type="submit" class="dropdown-item notify-item"><i class="ri-logout-box-line"></i>
                            <span>{{ __('logout') }}</span>
                        </button>
                    </form>
                </div>
            </li>

            <li class="dropdown notification-list">
                <a href="javascript:void(0);" class="nav-link right-bar-toggle waves-effect waves-light">
                    <i class="fe-settings noti-icon"></i>
                </a>
            </li>
        </ul>

        <!-- LOGO -->
        <div class="logo-box">
            <a href="/" class="logo logo-dark text-center">
                <span class="logo-sm">
                    <span class="logo-lg-text-light">E</span>
                </span>
                <span class="logo-lg">
                    <span class="logo-lg-text-light">Europfood</span>
                </span>
            </a>

            <a href="/" class="logo logo-light text-center">
                <span class="logo-sm">
                    <span class="logo-lg-text-light">E</span>
                </span>
                <span class="logo-lg">
                    <span class="logo-lg-text-light">Europfood</span>
                </span>
            </a>
        </div>

        <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
            <li>
                <button class="button-menu-mobile waves-effect waves-light">
                    <i class="fe-menu"></i>
                </button>
            </li>

            <li>
                <!-- Mobile menu toggle (Horizontal Layout)-->
                <a class="navbar-toggle nav-link" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
                    <div class="lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </a>
                <!-- End mobile menu toggle-->
            </li>
        </ul>
        <div class="clearfix"></div>
    </div>
</div>
