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

        <!-- App css -->
        <link href="{{ asset('css/saas/bootstrap-saas.min.css') }}" rel="stylesheet" type="text/css" id="bs-default-stylesheet" />
        <link href="{{ asset('css/saas/app-saas.min.css') }}" rel="stylesheet" type="text/css" id="app-default-stylesheet" />

        <link href="{{ asset('css/saas/bootstrap-saas-dark.min.css') }}" rel="stylesheet" type="text/css" id="bs-dark-stylesheet" />
        <link href="{{ asset('css/saas/app-saas-dark.min.css') }}" rel="stylesheet" type="text/css" id="app-dark-stylesheet" />

        <!-- icons -->
        <link href="{{ asset('css/icons.min.css') }}" rel="stylesheet" type="text/css" />
    </head>
    <body class="loading auth-fluid-pages pb-0">
        {{ $slot }}

        <!-- Vendor js -->
        <script src="{{ asset('js/vendor.min.js') }}"></script>

        <!-- App js -->
        <script src="{{ asset('js/app.min.js') }}"></script>
    </body>
</html>
