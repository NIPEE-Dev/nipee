@component('mail::message')
# Bem vindo!

Este é um email automático, sua conta foi criada e esta pronta para uso em nossa plataforma!

Senha de acesso: {{ $password }}

Aah, lembre-se de altera-lá quando acessar.

@component('mail::button', ['url' => config('app.asset_url')])
    Acessar Nipee
@endcomponent

Obrigado,
{{ config('app.name') }}
@endcomponent
