<script>
    $.expr[':'].icontains = function(el, i, m) {
        var search = m[3];
        if (!search) return false;

        var pattern = new RegExp(search, 'i');
        return pattern.test($(el).text());
    };

    const Ajax = {
        xhr: undefined,
        checkXhr(){
            if(this.xhr && this.xhr.readyState){
                this.xhr.abort();
            }
        },
        request(url, data, method, callback, options = {}){
            this.checkXhr();

            const defaultOptions = {
                url: url,
                data: data,
                method: method,
                success(response){
                    return callback(response);
                }
            }

            //$.ajax({...defaultOptions, ...options})
            $.ajax(Object.assign(defaultOptions, options));
        }
    }

    const DatatablesFactory = {
        datatables: [],
        defaultProps: {
            dom: 'Bfrtip',
            language: {
                paginate: {
                    previous: "<i class='mdi mdi-chevron-left'>",
                    next: "<i class='mdi mdi-chevron-right'>"
                }
            },
            drawCallback() {
                $(".dataTables_paginate > .pagination")
                    .addClass("pagination-rounded")
            }
        },
        make(anchor, props){
            this.datatables[anchor] = $(anchor).DataTable({...this.defaultProps, ...props})
            return this.datatables[anchor];
        },
        retrieve(anchor){
            return this.datatables[anchor] || null;
        },
        withButtons(buttons){
            return $.merge($.fn.dataTable.defaults.buttons, buttons);
        },
        destroy(anchor){
            $('#' + anchor).remove();
        }
    }


    const ModalsFactory = {
        modals: [],
        skeleton: `
            <div id="[[modalid]]" class="modal fade" tabindex="-1" [[backdrop]] role="dialog" aria-labelledby="[[modalid]]" aria-hidden="true" style="display: none;">
                <div class="modal-dialog [[size]]">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">[[title]]</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4">
                            [[content]]
                        </div>

                        [[footer]]
                    </div>
                </div>
            </div>
        `,
        footer: `
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">{{ __('close') }}</button>
                <button type="button" class="btn btn-info waves-effect waves-light submitButton">{{ __('save') }}</button>
            </div>
        `,
        backdrop: `data-backdrop="static"`,
        exists(anchor){
            return this.modals.includes(anchor);
        },
        show(anchor, options = {}){
            const modal = $('#' + anchor);
            if(options.ajax){
                Ajax.request(options.ajax.url, { ...options.ajax.data }, options.ajax.method || 'POST', ( response ) => {
                    modal.find('.modal-body').html(response)
                    if(options.ajax.loaded){
                        options.ajax.loaded(response, modal)
                    }
                })
            }else{
                modal.find('.modal-body').html(options.content)
            }

            return modal.modal('show');
        },
        add(anchor){
            this.modals.push(anchor);
        },
        make(anchor, title, options = {}){
            if(this.exists(anchor)){
                return;
            }

            const modal = this.translate(this.skeleton, anchor, options.size, title, options.content, options.footer, options.backdrop)
            this.buildModal(anchor, modal, options.domCallback)

            if(options.saveCallback){
                $('#' + anchor).find('button.submitButton').on('click', function(){
                    options.saveCallback($(this));
                })
            }
        },
        buildModal(anchor, modal, domCallback){
            if(typeof domCallback === 'function'){
                $('body').append(modal).promise().then(() => domCallback());
            }else{
                $('body').append(modal);
            }
            this.add(anchor);
        },
        translate(modal, modalid, size, title, content, footer, backdrop){
            return modal
                    .replaceAll('[[modalid]]', modalid)
                    .replace('[[size]]', size || '')
                    .replace('[[title]]', title)
                    .replace('[[content]]', content)
                    .replace('[[footer]]', footer ? this.footer : '')
                    .replace('[[backdrop]]', backdrop ? this.backdrop : '')
        }
    }
</script>
