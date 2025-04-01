@component('mail::message')
    # PROTOCOLO DE ENTREGA – RELATÓRIO DE AVALIAÇÃO DE ESTAGIÁRIOS (AS)

    Conforme a lei n° 11.788 de 2008, Artigo 9º - VII é obrigatório o preenchimento da Ficha de Avaliação e a entrega da Declaração Escolar Original dos estagiários (as). Pois é de responsabilidade da parte concedente o envio desses documentos. Mediante ao protocolo a Brilho Próprio se isenta de qualquer tipo de problema.

    Sendo assim,

    1 - Ficha de Avaliação em 3 vias
    As mesmas deverão ser preenchidas e entregue ao estagiário para as devidas assinaturas.

        Concedente
        Estagiário
        Instituição de Ensino

    2 - Retorno de Documentos
    - 1 via na Instituição de Ensino
    - 1 via retornará para a Brilho Próprio juntamente com a Declaração Escolar atualizada original (essa Declaração é a comprovação que eles estão devidamente matriculados), é obrigação da concedente cobrar de cada um deles, uma vez que está em contato pessoal todos os dias.
    - 1 via ficará com a empresa Concedente.

    Salientamos que conforme cláusula contratual a obrigação da Brilho Próprio é enviar para a concedente onde a mesma se responsabilizará pelo andamento e a não providencia não será responsabilidade nossa.

    Reforçamos que esse documento é de suma importância e também em uma possível reclamação trabalhista futura poderá ser solicitado, por isso devemos cumprir com a nossa obrigação, conforme o nosso contrato de prestação de serviço e legislação do estagiário.

    Prazo de entrega até o dia {{ now()->addDays(30)->format("d/m/Y") }}, para validar o seu estágio.
    Obs.: Caso falte a ficha de avaliação de algum estagiário, favor solicitar em resposta neste e-mail o faltante.

    Obrigado,
    {{ config('app.name') }}
@endcomponent
