<x-libs.jstree></x-libs.jstree>

@push('scripts')
    <script type="text/javascript">
        const page = {
            xhr: undefined,
            checkXhr() {
                if (this.xhr !== undefined && this.xhr.readyState) {
                    this.xhr.abort();
                }
            }
        }

        @if (Laravel\Fortify\Features::canUpdateProfileInformation())
        $(`#profile-form`).parsley({
            errorsContainer(e) {
                return e.$element.closest('.col-md-10');
            }
        }).on('form:submit', function () {
            let $form = $(`#profile-form`);

            page.checkXhr();
            page.xhr = $.ajax({
                url: `{{ route('user-profile-information.update') }}`,
                type: 'PUT',
                data: $form.serialize(),
                success(response) {
                    let timerInterval;

                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        html: 'A página irá atualizar em <b></b> segundos.',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                            timerInterval = setInterval(() => {
                                const content = Swal.getContent();
                                if (content) {
                                    const b = content.querySelector('b');
                                    if (b) {
                                        b.textContent = (Swal.getTimerLeft() / 1000)
                                            .toFixed(0);
                                    }
                                }
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        },
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            window.location.reload();
                        }
                    });
                }
            });

            return false;
        });
        @endif

        @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
        function updateImage(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();

                // Atualiza as imagens de perfil da página
                reader.onload = (e) => {
                    document.getElementById('profile-image').src = e.target.result;
                    document.getElementById('navbar-profile-image').src = e.target.result;
                }

                reader.readAsDataURL(input.files[0]); // convert to base64 string

                let formData = new FormData();
                formData.append('photo', input.files[0]);

                $.ajax({
                    url: `{{ route('user-profile-photo.update') }}`,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success() {
                        Swal.fire(
                            `Sucesso!`,
                            'Sua imagem de perfil foi atualizada.',
                            'success'
                        )
                    }
                })
            }
        }
        @endif

        @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::updatePasswords()))
        $(`#password-form`).parsley({
            errorsContainer(e) {
                return e.$element.closest('.col-md-10');
            }
        }).on('form:submit', function () {
            let $form = $(`#password-form`);

            page.checkXhr();
            page.xhr = $.ajax({
                url: `{{ route('user-password.update') }}`,
                type: 'PUT',
                data: $form.serialize(),
                success(response) {
                    $form[0].reset();
                    $form.parsley().reset();
                    $(`#password`).trigger('input');
                    Swal.fire(
                        'Sucesso!',
                        'Sua senha foi alterada.',
                        'success'
                    );
                }
            });

            return false;
        });

        $(document).on('input', `[name="password"]`, function () {
            let value = $(this).val();

            if (!value) {
                $(`[data-password-validate]`).removeClass();
                return;
            }

            $.each($(`[data-password-validate]`), function () {
                let pattern = new RegExp($(this).data('password-validate'));
                $(this).removeClass().addClass(pattern.test(value) ? 'text-success' : 'text-danger');
            });
        });
        @endif

        $(() => {
            $("#permissions-tree").jstree({
                core: {
                    themes: {
                        responsive: !1
                    }
                },
                types: {
                    default: {
                        icon: "fa fa-folder text-warning"
                    },
                }
            }).jstree('open_all').jstree('close_node', {id: 'j1_1_anchor'})
        });
    </script>
@endpush
