@props(['id', 'icon', 'title', 'save' => false, 'delete' => false, 'restore' => false, 'size' => false, 'scrollable' => true])

<div class="modal fade" id="modal-{{ $id }}" tabindex="-1" aria-labelledby="modal-{{ $id }}-title" aria-modal="true" role="dialog">
    <div class="modal-dialog @if ($scrollable === true) modal-dialog-scrollable @endif @if ($size !== false) {{ $size }} @endif" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-{{ $id }}-title">
                    <i class="{{ $icon }}"></i>&nbsp;
                    {!! $title !!}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                {{ $slot }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                @if ($save !== false)
                    <button type="button" class="btn btn-primary" id="modal-{{ $id }}-submit" onclick="$(`#modal-{{ $id }}-form`).submit();">Salvar</button>
                @endif
                @if ($delete !== false)
                    <button type="button" class="btn btn-danger" id="modal-{{ $id }}-delete" onclick="$(`#modal-{{ $id }}-form`).submit();">Deletar</button>
                @endif
                @if ($restore !== false)
                    <button type="button" class="btn btn-success" id="modal-{{ $id }}-delete" onclick="$(`#modal-{{ $id }}-form`).submit();">Restaurar</button>
                @endif
                {{ $actions ?? '' }}
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>