<div class="navbar-custom">
    <div class="container-fluid">
        <ul class="list-unstyled topnav-menu float-end mb-0">
            <li class="dropdown @if($fromTablet) d-block @else d-none d-lg-inline-block @endif">
                <a class="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="fullscreen" href="#">
                    <i class="fe-maximize noti-icon"></i>
                </a>
            </li>

            <li class="dropdown d-block topbar-dropdown">
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

        </ul>

        <!-- LOGO -->
        <a href="{{ url()->current() }}">
            <div class="d-flex justify-content-center">
                <div>
                    <p class="commerce-title">
                        {{ $commerce->name }}<br>
                        <span class="commerce-subtitle" style="margin-left: {{ $commerce->visualIdentity->subtitle_align }}px">
                            <small>{{ $commerce->description }}</small>
                        </span>
                    </p>
                </div>
            </div>
        </a>
        <div class="clearfix"></div>
    </div>
</div>
