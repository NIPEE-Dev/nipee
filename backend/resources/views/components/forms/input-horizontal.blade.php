<div class="mb-2 row">
    <label for="{{ $attributes->has('id') ? $attributes->get('id') : $id }}" class="col-md-2 col-form-label">{{ $label }}</label>
    <div class="col-md-10">
        @if($group)
            <div class="input-group input-group-merge">
                <input class="form-control" name="{{ $name }}" {{ $attributes->merge(['value' => old($name), 'id' => $id]) }}>
                {{ $slot }}
            </div>
            {{ $help ?? '' }}
        @else
            <input class="form-control" name="{{ $name }}" {{ $attributes->merge(['value' => old($name), 'id' => $id]) }}>
            {{ $slot }}
        @endif
    </div>
</div>