<div class="tab-pane" id="tab_password">
    <form id="password-form">
        <x-forms.input-horizontal label="Senha atual" name="current_password" type="password" group="1" required>
            <div class="input-group-text" data-password="false">
                <span class="password-eye"></span>
            </div>
        </x-forms.input-horizontal>
        <x-forms.input-horizontal label="{{ __('password.new') }}" id="password" name="password" type="password" group="1" minlength="8" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" required>
            <div class="input-group-text" data-password="false">
                <span class="password-eye"></span>
            </div>
            <x-slot name="help">
                <span class="help-block">
                    {!! __('password.validation') !!}
                </span>
            </x-slot>
        </x-forms.input-horizontal>
        <x-forms.input-horizontal label="{{ __('password.confirm') }}" name="password_confirmation" type="password" group="1" data-parsley-equalto="#password" required>
            <div class="input-group-text" data-password="false">
                <span class="password-eye"></span>
            </div>
        </x-forms.input-horizontal>

        <div class="text-end">
            <button type="submit" class="btn btn-success waves-effect waves-light mt-2"><i class="mdi mdi-content-save"></i>{{ __('save.updates') }}</button>
        </div>
    </form>
</div>
