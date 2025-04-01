<!-- Right Sidebar -->
<div class="right-bar">
    <div data-simplebar class="h-100">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs nav-bordered nav-justified" role="tablist">
            <li class="nav-item">
                <a class="nav-link py-2 active" data-bs-toggle="tab" href="#settings-tab" role="tab">
                    <i class="mdi mdi-cog-outline d-block font-22 my-1"></i>
                </a>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content pt-0">
            <div class="tab-pane active" id="settings-tab" role="tabpanel">
                <h6 class="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
                    <span class="d-block py-1">{{ __('theme.settings') }}</span>
                </h6>

                <div class="p-3">
                    <div class="alert alert-warning" role="alert">
                        {!! __('theme.settings.configure.message') !!}
                    </div>

                    <h6 class="fw-medium font-14 mt-4 mb-2 pb-1">{{ __('theme.geral') }}</h6>
                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="color-scheme-mode" value="light" id="light-mode-check" checked>
                        <label class="form-check-label" for="light-mode-check">{{ __('theme.light') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="color-scheme-mode" value="dark" id="dark-mode-check">
                        <label class="form-check-label" for="dark-mode-check">{{ __('theme.dark') }}</label>
                    </div>

                    <!-- Width -->
                    <h6 class="fw-medium font-14 mt-4 mb-2 pb-1">Layout</h6>
                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="width" value="fluid" id="fluid-check" checked>
                        <label class="form-check-label" for="fluid-check">{{ __('theme.fluid') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="width" value="boxed" id="boxed-check">
                        <label class="form-check-label" for="boxed-check">{{ __('theme.box') }}</label>
                    </div>


                    <!-- Topbar -->
                    <h6 class="fw-medium font-14 mt-4 mb-2 pb-1">{{ __('theme.navigation.bar') }}</h6>
                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="topbar-color" value="dark" id="darktopbar-check" checked>
                        <label class="form-check-label" for="darktopbar-check">{{ __('theme.dark') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="topbar-color" value="light" id="lighttopbar-check">
                        <label class="form-check-label" for="lighttopbar-check">{{ __('theme.light') }}</label>
                    </div>


                    <!-- Left Sidebar-->
                    <h6 class="fw-medium font-14 mt-4 mb-2 pb-1">{{ __('theme.navigation.bar.left') }}</h6>
                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="leftsidebar-color" value="light" id="light-check" checked>
                        <label class="form-check-label" for="light-check">{{ __('theme.light') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="leftsidebar-color" value="dark" id="dark-check">
                        <label class="form-check-label" for="dark-check">{{ __('theme.dark') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="leftsidebar-color" value="brand" id="brand-check">
                        <label class="form-check-label" for="brand-check">{{ __('theme.mark.color') }}</label>
                    </div>

                    <div class="form-check form-switch mb-1">
                        <input class="form-check-input" type="checkbox" name="leftsidebar-color" value="gradient" id="gradient-check">
                        <label class="form-check-label" for="gradient-check">{{ __('theme.mark.gradient') }}</label>
                    </div>

                    <hr>

                    <div class="d-grid">
                        <button class="btn btn-primary" id="resetBtn">{{ __('theme.reset') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div> <!-- end slimscroll-menu-->
</div>
<!-- /Right-bar -->

<!-- Right bar overlay-->
<div class="rightbar-overlay"></div>
