@props(['id' => uniqid(), 'striped' => true, 'bordered' => false])

<table id="{{ $id }}" class="table table-condensed nowrap
                             align-middle w-100 font-12
                             {{ $striped === true ? 'table-striped' : '' }}
                             {{ $bordered !== false ? 'table-bordered' : '' }}">
    {{ $slot }}
</table>