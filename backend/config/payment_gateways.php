<?php

return [
    'gateways' => [
        'asaas' => [
            'environment' => env('ASAAS_ENVIRONMENT', 'dev'),
            'api_key' => env('ASAAS_API_KEY'),
            'base_url_sandbox' => 'https://sandbox.asaas.com/api/v3/',
            'base_url_production' => 'https://www.asaas.com/api/v3/',
        ]
    ]
];