<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senha Alterada com Sucesso</title>
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
            color: #ffffff;
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
        <h1>Alteração de Senha com Sucesso</h1>
        <p class="greeting">Exmo(a). Sr(a) {{ $userName }},</p>
        <p>Informamos que a sua senha foi alterada com sucesso na nossa plataforma.</p>
        <p>Agora, para completar o seu cadastro e acessar todas as funcionalidades, por favor, acesse a plataforma e complete o seu perfil.</p>
        <div class="footer">
            <p>Cumprimentos,<br>A equipa da <strong>NIPEE</strong></p>
            <p>© 2025 NIPEE. Todos os direitos reservados.</p>
        </div>
    </div>

</body>
</html>
