<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset('images/logo-dark.png') }}" class="logo" alt="Europfood">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
