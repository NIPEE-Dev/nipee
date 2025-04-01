@foreach($items as $item)
    @if($item->childrens->isNotEmpty())
        <li class="nav-item">
            <a href="#menu_{{ $item->id }}" data-bs-toggle="collapse" class="nav-link">
                <span> {{ $item->name }} </span>
                <span class="menu-arrow"></span>
            </a>
            <div class="collapse" id="menu_{{ $item->id }}">
                <ul class="nav-second-level">
                    <x-layouts.menu-list :items="$item->childrens"></x-layouts.menu-list>
                </ul>
            </div>
        </li>
    @else
        <li class="nav-item">
            <a class="nav-link" href="{{ $item->route }}">{{ $item->name }}</a>
        </li>
    @endif
@endforeach