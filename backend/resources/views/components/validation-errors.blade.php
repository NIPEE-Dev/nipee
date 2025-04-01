@if ($errors->any())
    <div {{ $attributes }}>
        <div class="font-20">{{ __('whats.wrong') }}</div>

        <ul class="mt-3 text-danger">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
