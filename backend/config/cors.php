<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://localhost:8088',
        'http://localhost:8000',
        'https://nipee.org',
        'https://api.nipee.org',
        'https://dev-api.nipee.org',
        'https://dev.nipee.org',
        'http://v2.brilhoestagio.com.br',
        'http://leste-frontend.brilhoestagio.com.br',
        'https://leste-frontend.brilhoestagio.com.br',
        'http://guarulhos-frontend.brilhoestagio.com.br',
        'https://guarulhos-frontend.brilhoestagio.com.br',
        'https://bcdesenvolvimento.com',
        'https://nipee.bcdesenvolvimento.com'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
