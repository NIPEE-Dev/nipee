<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foste selecionado para a próxima fase da tua FCT/Estágio!</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            color: #444;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            font-size: 16px;
        }
        h1 {
            color: #5A34EA;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #5A34EA;
            margin-bottom: 15px;
        }
        .content {
            margin-bottom: 25px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #aaa;
        }
        .footer a {
            color: #5A34EA;
            text-decoration: none;
            font-weight: bold;
        }
        .table-container {
            display: block;
            white-space: nowrap;
            width: 100%;
            margin-top: 20px;
            margin-bottom: 20px
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
</head>
<body>

    <div class="email-container">
        <h1>Foste selecionado para a próxima fase da tua FCT/Estágio!</h1>
        <p class="greeting">Parabéns! 🎊</p>
        <p class="greeting">Foste selecionado(a) para a próxima fase do processo de recrutamento para a(s) seguinte(s) oportunidade(s)</p>
        <div class="content">
            
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nome da Vaga</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($jobs as $job)
                        <tr>
                            <td>{{ $job->role->title }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <p>Em breve, entraremos em contacto consigo para agendar a sua entrevista.</p>
        <p>Fique atento(a) ao seu e-mail e telemóvel! 📞📧</p>
        </div>
        <div class="footer">
            <p>Cumprimentos,<br>A equipa da <strong>NIPEE</strong></p>
            <p>© {{ date('Y') }} NIPEE. Todos os direitos reservados.</p>
        </div>
    </div>

</body>
</html>
