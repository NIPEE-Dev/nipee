<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>{{ config('app.name', 'Europfood') }}</title>
        <!-- App favicon -->
        <link rel="shortcut icon" href="{{  asset('images/favicon.ico') }}">

        <!-- Plugin css -->
        <link href="{{ asset('css/custom.css') }}" rel="stylesheet" type="text/css" />
        <link href="{{ asset('css/animate.min.css') }}" rel="stylesheet" type="text/css" />
        <link href="{{ asset('libs/sweetalert2/sweetalert2.min.css') }}" rel="stylesheet" type="text/css" />
        <link href="{{ asset('libs/bootstrap-select/css/bootstrap-select.min.css') }}" rel="stylesheet">
        <link href="{{ asset('libs/bootstrap-daterangepicker/daterangepicker.css') }}" rel="stylesheet">
        <link href="{{ asset('libs/select2/css/select2.min.css') }}" rel="stylesheet">
        <link href="{{ asset('libs/mohithg-switchery/switchery.min.css') }}" rel="stylesheet">
        <link href="{{ asset('libs/ion-rangeslider/css/ion.rangeSlider.min.css') }}" rel="stylesheet">

        <x-libs.datatables></x-libs.datatables>
        @stack('styles')


        <!-- App css -->
        <link href="{{ asset('css/modern/bootstrap-modern.min.css') }}" rel="stylesheet" type="text/css" id="bs-default-stylesheet" />
        <link href="{{ asset('css/modern/app-modern.min.css') }}" rel="stylesheet" type="text/css" id="app-default-stylesheet" />

        <link href="{{ asset('css/modern/bootstrap-modern-dark.min.css') }}" rel="stylesheet" type="text/css" id="bs-dark-stylesheet" />
        <link href="{{ asset('css/modern/app-modern-dark.min.css') }}" rel="stylesheet" type="text/css" id="app-dark-stylesheet" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
            * {
                font-family: 'Poppins', sans-serif;
            }
        </style>

        <!-- icons -->
        <link href="{{ asset('css/icons.min.css') }}" rel="stylesheet" type="text/css" />
    </head>
    <body class="loading" data-layout-mode="detached">

        <!-- Pre-loader -->
        <div id="preloader">
            <div id="status">
                <div class="spinner">Loading...</div>
            </div>
        </div>

        <!-- Begin page -->
        <div id="wrapper">
            <x-layouts.navbar></x-layouts.navbar>

            <x-layouts.left-menu></x-layouts.left-menu>

            <div class="content-page">
                @if((auth()->user()->is_admin && \request()->user()->isInPreviewMode()))
                    <div class="alert alert-info mt-3" role="alert">
                        <i class="mdi mdi-alert-circle-outline me-2"></i> Você esta em modo de pré-visualização do comércio <b class="font-16">{{ auth()->user()->commerce->name . ' ~ ' . auth()->user()->commerce->description }}</b>.
                        <a href="{{ route('admin.viewAs.back') }}" class="alert-link"><button type="button" class="btn btn-soft-purple waves-effect waves-light">clique aqui</button></a> para sair.
                    </div>
                @endif
                <div class="content">
                    <div class="container-fluid">
                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box page-title-box-alt">
                                    <h4 class="page-title">{{ $title ?? 'Título' }}</h4>
                                    <div class="page-title-right">
                                        <div class="d-flex align-items-center">
                                            {{ $breadcrumb ?? '' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end page title -->

                        <div id="container-notifications"></div>
                        {{ $slot }}
                    </div>
                </div>

                <!-- Footer Start -->
                <footer class="footer">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col--12 text-center">
                                <script>document.write(new Date().getFullYear())</script> &copy; Europfood
                            </div>
                        </div>
                    </div>
                </footer>
                <!-- end Footer -->
            </div>
        </div>

        <x-layouts.rightbar></x-layouts.rightbar>

        <!-- Vendor js -->
        <script src="{{ asset('js/vendor.min.js') }}"></script>
        <script src="{{ asset('libs/sweetalert2/sweetalert2.all.min.js') }}"></script>
        <script src="{{ asset('libs/parsleyjs/parsley.min.js') }}"></script>
        <script src="{{ asset('libs/parsleyjs/i18n/pt-br.js') }}"></script>
        <script src="{{ asset('libs/jquery-mask-plugin/jquery.mask.min.js') }}"></script>
        <script src="{{ asset('libs/moment/moment.js') }}"></script>
        <script src="{{ asset('libs/moment/locale/pt-br.js') }}"></script>
        <script src="{{ asset('libs/bootstrap-select/js/bootstrap-select-custom.js') }}"></script>
        <script src="{{ asset('libs/bootstrap-select/js/i18n/defaults-pt_BR.js') }}"></script>
        <script src="{{ asset('libs/bootstrap-daterangepicker/daterangepicker.js') }}"></script>
        <script src="{{ asset('libs/select2/js/select2.min.js') }}"></script>
        <script src="{{ asset('libs/mohithg-switchery/switchery.min.js') }}"></script>
        <script src="{{ asset('libs/ion-rangeslider/js/ion.rangeSlider.min.js') }}"></script>
        <script src="{{ asset('libs/tippy.js/tippy.all.min.js') }}"></script>
        <script src="{{ asset('js/custom.js') }}"></script>

        <!-- Plugins js-->
        @include('shared.scripts')

        @stack('scripts')

        <!-- App js -->
        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
