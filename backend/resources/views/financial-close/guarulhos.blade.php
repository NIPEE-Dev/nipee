@php use App\Enums\Financial\Company\TaxEnum; @endphp
<style>
    html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
    }

    *, *::before, ::after {
        word-wrap: break-word;
    }

    *, *::before, *::after {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
    }

    *, *::before, ::after {
        word-wrap: break-word;
    }

    *, *::before, *::after {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
    }

    .table-container {
        display: block;
        white-space: nowrap;
        width: 100%;
        margin-top: 50px;
    }

    table {
        width: 100%
    }

    table thead tr th, .title {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
        text-align: start;
        padding: 0.5rem 1rem;
        line-height: 1rem;
        font-size: 0.75rem;
        color: #4A5568;
    }

    tr td {
        text-align: start;
        padding: 0 1rem;
        font-size: 0.875rem;
        line-height: 1.2rem;
    }

    table tr:nth-child(odd) td {
        background: #EDF2F7;
    }

    table tr:nth-child(odd) th, table tr:nth-child(odd) td {
        border-bottom-width: 1px;
        border-color: #EDF2F7;
    }
</style>

<table>
    <tr>
        <td align="center" style="background: transparent">
            <img height="120" width="111" src="{{ public_path('img/logo-guarulhos.png') }}"/>
        </td>
    </tr>
    <tr>
        <td>
            <p class="title"><br>&nbsp;&nbsp;&nbsp;&nbsp;Conforme contrato com a empresa Brilho Próprio Estágios e de
                acordo de
                Cooperação
                e
                Termo de Compromisso de
                Estágio, previstos na Lei n°. 11788 de 25 de setembro de 2008, declaro para todos os fins e efeitos ter
                recebido da Empresa concedente de Estágio:
                <strong>{{ strtoupper($financialCloseCompany->company->corporate_name) }}</strong> - CNPJ
                <strong>{{ strtoupper($financialCloseCompany->company->cnpj) }}</strong>
                relativo
                ao pagamento das taxas de administração.</p>
        </td>
    </tr>
</table>

<div class="table-container">
    <table>
        <thead>
        <tr>
            <th>Estagiário</th>
            <th>Início</th>
            <th>Término</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Referência</th>
        </tr>
        </thead>
        <tbody>
        @foreach($financialCloseCompany->items->sortBy('contract.candidate.name') as $data)
            <tr>
                <td>{{ $data->contract->candidate->name }}</td>
                <td>{{ $data->contract->start_contract_vigence->format("d/m/Y") }}</td>
                <td>{{ $data->contract->terminated_at ? $data->contract->terminated_at->format("d/m/Y") : $data->contract->end_contract_vigence->format("d/m/Y") }}</td>
                <td>R$ {{ number_format((float) $data->value, 2, ",", ".") }}</td>
                <td>
                    @include('financial-close.type', ['types' => [$data->type]])
                </td>
                <td>
                    @if($data->start_date && $data->end_date)
                        @if($data->type === TaxEnum::MONTHLY_PAYMENT_RETROATIVE)
                            {{ ucfirst($data->start_date->translatedFormat("F/Y")) }}
                            à {{ ucfirst($data->end_date->translatedFormat("F/Y")) }}
                        @else
                            {{ ucfirst($data->end_date->translatedFormat("F/Y")) }}
                        @endif
                    @elseif($data->start_date && !$data->end_date)
                        {{ ucfirst($data->start_date->translatedFormat("F/Y")) }}
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
        <tfoot>
        <tr>
            <td style="background: #4FD1C5">Total</td>
            <td style="background: #4FD1C5; text-align: center">
                R$ {{ number_format((float) $financialCloseCompany->items->sum('value'), 2, ",", ".") }}</td>
        </tr>
        </tfoot>
    </table>
</div>

<br>
<br>
<br>
<br>
<br>
<table>
    <tr>
        <td style="background: transparent;"></td>
        <td align="right" style="border-top: 1px solid black; background: transparent;">BRILHO PRÓPRIO ADM. TREINAMENTO
            E DESENVOLVIMENTO LTDA
        </td>
    </tr>
</table>