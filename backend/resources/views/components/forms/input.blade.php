<div class="mb-2">
    <label for="{{ $attributes->has('id') ? $attributes->get('id') : $id }}" class="form-label">{{ $label }}</label>
    <input class="form-control" name="{{ $name }}" {{ $attributes->merge(['value' => old($name), 'id' => $id]) }}>
    {{ $slot }}
</div>
