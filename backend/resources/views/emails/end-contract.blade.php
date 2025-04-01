@component('mail::message')
# Aviso de Término de Contrato

Informamos que o contrato do Estagiário (a) {{ $name }} será encerrado em {{ $date }}.

Obrigado,
{{ config('app.name') }}
@endcomponent
