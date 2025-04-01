<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordChangeSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $userName
     */
    public function __construct($userName)
    {
        $this->userName = $userName;
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Senha alterada com sucesso')
                    ->view('emails.password_change_success')
                    ->with([
                        'userName' => $this->userName,
                    ]);
    }
}
