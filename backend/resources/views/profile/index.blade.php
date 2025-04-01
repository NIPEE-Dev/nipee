<x-app-layout title="Meu perfil">
    @include('profile.style')
    @include('profile.script')

    <x-slot name="breadcrumb">
        <ol class="breadcrumb m-0">
            <li class="breadcrumb-item"><a href="javascript: void(0);">{{ $user->name }}</a></li>
            <li class="breadcrumb-item active">Perfil</li>
        </ol>
    </x-slot>

    <div class="row">
        <div class="col-lg-4 col-xl-4">
            <div class="card text-center">
                <div class="card-body">
                    <div class="position-relative">
                        <img id="profile-image" onerror="this.src='{{ asset('images/users/avatar-example.png') }}'"
                             src="{{ asset($user->profile_photo_path ? 'storage/' . $user->profile_photo_path : 'images/users/avatar-example.png') }}"
                             class="rounded-circle avatar-xl img-thumbnail"
                             alt="profile-image">
                        @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                        <input type="file" name="profile-image" id="input-profile-image" class="d-none" onchange="updateImage(this)" />
                        <button type="button" class="position-absolute btn btn-primary btn-sm btn-rounded waves-effect waves-light" onclick="$(`#input-profile-image`).click();" title="Alterar foto" style="bottom: -20px;right: calc(50% - 60px);">
                            <i class="mdi mdi-camera-flip-outline"></i>
                        </button>
                        @endif
                    </div>


                    <h4 class="mt-3 mb-0">{{ $user->name }}</h4>
                    <p class="text-muted">{{ $user->roles->first()->title }}</p>

                    <div class="text-start mt-3">
                        <div class="table-responsive">
                            <table class="table table-borderless table-sm">
                                <tbody>
                                <tr>
                                    <th scope="row">{{ __('complete.name') }}:</th>
                                    <td class="text-muted">{{ $user->name }}</td>
                                <tr>
                                    <th scope="row">{{ __('email') }}:</th>
                                    <td class="text-muted">{{ $user->email }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> <!-- end card-box -->

            <div class="card">
                <div class="card-body">
                    <h4 class="header-title">{{ __('permissions') }}</h4>
                    <p class="sub-header mb-3">{{ __('permissions.can.text') }}</p>

                    <div id="permissions-tree">
                        <ul>
                            <li><b>{{ config('app.name') }}</b>
                                @include('credentials.roles.tree', ['items' => $permissions])
                            </li>
                        </ul>
                    </div>
                </div>
            </div> <!-- end card-box-->

        </div> <!-- end col-->

        <div class="col-lg-8 col-xl-8">
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs nav-bordered">
                        @if (Laravel\Fortify\Features::canUpdateProfileInformation())
                        <li class="nav-item">
                            <a href="#tab_settings" data-bs-toggle="tab" aria-expanded="false" class="nav-link active ms-0">
                                <i class="mdi mdi-cog me-1"></i>{{ __('settings') }}
                            </a>
                        </li>
                        @endif

                        @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::updatePasswords()))
                        <li class="nav-item">
                            <a href="#tab_password" data-bs-toggle="tab" aria-expanded="false" class="nav-link">
                                <i class="mdi mdi-cog me-1"></i>{{ __('password.change') }}
                            </a>
                        </li>
                        @endif
                    </ul>

                    <div class="tab-content">
                        @if (Laravel\Fortify\Features::canUpdateProfileInformation())
                            @include('profile.update-profile-information-form')
                        @endif

                        @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::updatePasswords()))
                            @include('profile.update-password-form')
                        @endif
                        <!-- end settings content-->

                    </div> <!-- end tab-content -->
                </div>
            </div> <!-- end card-->

        </div> <!-- end col -->
    </div>
</x-app-layout>
