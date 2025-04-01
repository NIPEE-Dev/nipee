@component('mail::message')
# Aviso de férias

Informamos que o Estagiário (a) {{ $name }} terá seu aviso de férias em {{ $date }}.

Obrigado,
{{ config('app.name') }}
@endcomponent
