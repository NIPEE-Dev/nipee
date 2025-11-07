<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pré-Registo Enviado com Sucesso</title>
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
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #5A34EA;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #4a29b2;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <h1>Pré-Registo Enviado com Sucesso</h1>
        <p class="greeting">Exmo(a). Sr(a) {{ $representativeName }},</p>
        <div class="content">
            <p>É com grande satisfação que informamos que o seu registo na nossa plataforma foi submetido para aprovação com sucesso. Em breve entraremos em contacto para informar o estado do seu pré-registo.</p>
            <p>Agradecemos o interesse e a confiança na nossa plataforma. Caso tenha alguma dúvida ou pretenda obter mais informações, não hesite em contactar-nos.</p>
        </div>
        <div class="footer">
            <p>Cumprimentos,<br>A equipa da <strong>NIPEE</strong></p>
            <p>© {{ date('Y') }} NIPEE. Todos os direitos reservados.</p>
        </div>
    </div>

</body>
</html>
