<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationApproveSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $representativeName;
    public $passwordResetLink;

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $representativeName
     * @param string $passwordResetLink
     */
    public function __construct($representativeName, $passwordResetLink)
    {
        $this->representativeName = $representativeName;
        $this->passwordResetLink = $passwordResetLink;
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Aprovação do Cadastro na Plataforma - Acesso Ativado')
                    ->view('emails.pre_registration_approve_success')
                    ->with([
                        'representativeName' => $this->representativeName,
                        'passwordResetLink' => $this->passwordResetLink,
                    ]);
    }
}
