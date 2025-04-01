<div class="tab-pane show active" id="tab_settings">
    <form id="profile-form">
        <h5 class="mb-3 text-uppercase bg-light p-2"><i class="mdi mdi-account-circle me-1"></i> {{ __('personal.information') }}</h5>

        <div class="row">
            <div class="col-12">
                <x-forms.input label="{{ __('complete.name') }}" type="text" name="name" value="{{ $user->name }}" required></x-forms.input>
            </div>
        </div> <!-- end row -->

        <div class="row">
            <div class="col-12">
                <x-forms.input label="{{ __('email') }}" type="email" name="email" value="{{ $user->email }}" required>
                    {{--<span class="form-text text-muted"><small>If you want to change email please <a href="javascript: void(0);">click</a> here.</small></span>--}}
                </x-forms.input>
            </div> <!-- end col -->
        </div> <!-- end row -->

        <div class="text-end">
            <button type="submit" class="btn btn-success waves-effect waves-light mt-2"><i class="mdi mdi-content-save"></i>{{ __('save.updates') }}</button>
        </div>
    </form>

</div>
