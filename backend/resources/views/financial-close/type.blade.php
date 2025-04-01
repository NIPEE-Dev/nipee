<table>
    <tbody>
    <tr>
        <td style="background-color: none">
            @foreach($types as $type)
                <table>
                    <tbody>
                    <tr>
                        @switch($type->value)
                            @case(0)
                                <td class="badge-0"
                                    style="padding:2px 5px;text-align: center;background: #C6F6D5; color: #22543D">
                                    Adesão
                                </td>
                                @break
                            @case(1)
                                <td class="badge-1"
                                    style="padding:2px 5px;text-align: center;background: #C6F6D5; color: #22543D">
                                    Mensalidade
                                </td>
                                @break
                            @case(2)
                                <td class="badge-0"
                                    style="padding:2px 5px;text-align: center;background: #C6F6D5; color: #22543D">
                                    Adesão
                                </td>
                                <td class="badge-2"
                                    style="padding:2px 5px;text-align: center;background: #FEEBC8; color: #7B341E">
                                    Recolocação
                                </td>
                                @break
                            @case(3)
                                <td class="badge-3"
                                    style="padding:2px 5px;text-align: center;border-radius: 50px;background: #B2F5EA; color: #234E52">
                                    Mensalidade
                                    Retroativa
                                </td>
                                @break
                        @endswitch
                    </tr>
                    </tbody>
                </table>
            @endforeach
        </td>
    </tr>
    </tbody>
</table>