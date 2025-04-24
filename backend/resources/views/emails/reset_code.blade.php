<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificação</title>
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
        .code-box {
            display: inline-block;
            background-color: #f1f1f1;
            padding: 14px 24px;
            font-size: 24px;
            font-weight: bold;
            color: #5A34EA;
            border-radius: 8px;
            letter-spacing: 4px;
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
        <h1>Código de Verificação</h1>
        <p class="greeting">Olá, {{ $name }}!</p>
        <p>Recebemos uma solicitação para alterar a sua senha. Use o código abaixo para prosseguir com a redefinição:</p>
        <p class="code-box">{{ $code }}</p>
        <p>Este código é válido por 10 minutos. Se você não solicitou esta alteração, ignore este e-mail.</p>
        <div class="footer">
            <p>Atenciosamente,<br>A equipa da <strong>NIPEE</strong></p>
            <p>© 2025 NIPEE. Todos os direitos reservados.</p>
        </div>
    </div>

</body>
</html>
