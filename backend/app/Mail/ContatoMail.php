<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContatoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $dados;

    public function __construct($dados)
    {
        $this->dados = $dados;
    }

    public function build()
    {
        return $this->from(('mailtrap@luizagarcia.com'))
                    ->subject('Mensagem de Contato')
                    ->view('emails.contato')
                    ->with('dados', $this->dados);
    }
}
