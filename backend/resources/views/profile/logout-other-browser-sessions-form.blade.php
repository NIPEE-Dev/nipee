@if (count($this->sessions) > 0)
    <div>
        <h5 class="my-3 text-uppercase bg-light p-2"><i class="mdi mdi-account-circle me-1"></i> Sessões ativas</h5>
        <!-- Other Browser Sessions -->
        <ul class="list-group">
            @foreach ($this->sessions as $session)
                <li class="list-group-item">
                    <div class="d-flex align-items-center">
                        <div class="font-24 d-inline-block">
                            @if ($session->agent->isDesktop())
                                <i class="mdi mdi-desktop-mac"></i>
                            @else
                                <i class="mdi mdi-cellphone"></i>
                            @endif
                        </div>
                        <div class="ms-3 d-inline-block">
                            <div class="font-14 text-muted">
                                {{ $session->agent->platform() }} - {{ $session->agent->browser() }}
                            </div>

                            <div>
                                <div class="font-12 text-muted">
                                    {{ $session->ip_address }}

                                    @if ($session->is_current_device)
                                        <span class="text-success font-10 fw-bold">{{ __('This device') }}</span>
                                    @else
                                        {{ __('Last active') }} {{ $session->last_active }}
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            @endforeach
        </ul>
        <button class="btn btn-primary waves-effect waves-light mt-3" data-bs-toggle="modal" data-bs-target="#modal-sessions-logout">
            {{ __('Log Out Other Browser Sessions') }}
        </button>

        <x-modal id="sessions-logout" icon="mdi mdi-desktop-mac" title="{{ __('Log Out Other Browser Sessions') }}" save="0" delete="0">
            <form id="modal-sessions-logout-form" method="POST" action="{{ route('user-password.update') }}">
                {{ __('Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.') }}
                <x-forms.input label="" type="password" name="password" required x-ref="password"
                               wire:model.defer="password"
                               wire:keydown.enter="logoutOtherBrowserSessions"></x-forms.input>
            </form>
            <x-slot name="actions">
                <button type="button" class="btn btn-primary" id="modal-sessions-logout-submit" onclick="$(`#modal-sessions-logout-form`).submit();">{{ __('Log Out Other Browser Sessions') }}</button>
            </x-slot>
        </x-modal>
    </div>
@endif