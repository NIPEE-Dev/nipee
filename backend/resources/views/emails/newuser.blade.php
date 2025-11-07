<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sua Conta foi Criada</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            color: #444;
        }
        .email-wrapper {
            padding: 20px;
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
        .content {
            margin-bottom: 25px;
            border-top: 1px solid #eee;
            padding-top: 25px;
        }
        .password-box {
            background-color: #f0f4ff;
            border: 1px solid #5A34EA;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
        }
        .password-box strong {
            color: #5A34EA;
            font-size: 24px;
            display: block;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #aaa;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .footer strong {
            color: #444;
        }
        .button-wrapper {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #5A34EA;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #4a29b2;
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-container">
        <h1 class="color-[#4a29b2]">Bem-vindo(a)!</h1>
        
        <div class="content">
            <p>É com satisfação que informamos que a sua conta foi criada e já está pronta para utilização na nossa plataforma!</p>

            <div class="password-box">
                A sua palavra-passe temporária de acesso é:<br>
                <strong>{{ $password }}</strong>
            </div>

            <p>Ah! Não se esqueça de aceder à plataforma e alterar a sua palavra-passe de imediato, por motivos de segurança.</p>
        </div>

        <div class="button-wrapper">
            <a href="{{ config('app.asset_url') }}" class="button">
                Acessar Nipee
            </a>
        </div>
        
        <div class="footer">
            <p>Obrigado,<br>A equipa da <strong>{{ config('app.name') }}</strong></p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. Todos os direitos reservados.</p>
        </div>
    </div>
</div>
</body>
</html>
