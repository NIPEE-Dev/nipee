@component('mail::message')
# Parabéns!

Você foi selecionado(a) para a próxima etapa das seguintes vaga(s):

@component('mail::table')
| Nome da Vaga
| ------------ |
@foreach($jobs as $job)
| {{ $job->role->title }} |
@endforeach

@endcomponent

Entraremos em contato, <br>
{{ config('app.name') }}
@endcomponent