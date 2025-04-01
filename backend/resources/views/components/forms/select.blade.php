@props(['id' => '', 'label' => '', 'options' => [], 'selected' => [], 'text' => []])

<div class="mb-2">
    <label class="form-label" for="{{ $id }}">{{ $label }}</label> <br/>
    <select aria-label="" id="{{ $id }}" data-style="btn-primary" data-live-search="true"
            data-container="body" data-actions-box="true" data-select-all-text="{{ __('forms.select.all') }}"
            data-deselect-all-text="{{ __('forms.select.nothing') }}" data-title="{{ __('forms.select.count.select') }}"
            data-count-selected-text="{0} {{ __('forms.select.count.selected') }}"
            data-size="6" data-selected-text-format="count" data-width="100%" {{ $attributes->merge(['class' => 'selectpicker']) }}
            required>
        @if ($options !== null)
            @foreach($options as $option)
                <option {{ in_array($option->id, $selected) ? 'selected' : '' }} value="{{ $option->id }}">
                    @foreach ($text as $attribute)
                        {{ $option->{$attribute} . (!$loop->last ? ' - ' : '') }}
                    @endforeach
                </option>
            @endforeach
        @endif
        {{ $slot }}
    </select>
</div>
