<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aprovação do Registo na Plataforma - Acesso Ativado</title>
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
        .link-button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #5A34EA;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
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
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Aprovação do Registo na Plataforma - Acesso Ativado</h1>
        <p class="greeting">Exmo(a). Sr(a) {{ $full_name }},</p>
        <p>É com satisfação que informamos que o seu registo na nossa plataforma foi aprovado com sucesso.</p>
        <p>Para aceder à plataforma, utilize o link abaixo para definir a sua palavra-passe</p>
        <a href="{{ $passwordResetLink }}" class="link-button">Definir Senha</a>
        <p><strong>Nota:</strong>Este link será válido por 30 dias. Caso tenha alguma dificuldade ou dúvida, não hesite em contactar o nosso suporte.</p>
        <div class="footer">
            <p>Cumprimentos,<br>A equipa da <strong>NIPEE</strong></p>
            <p>© {{ date('Y') }} NIPEE. Todos os direitos reservados.</p>
        </div>
    </div>

</body>
</html>
