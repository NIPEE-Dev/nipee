<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationStudentsApproveSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $full_name;
    public $passwordResetLink;

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $representativeName
     * @param string $passwordResetLink
     */
    public function __construct($full_name, $passwordResetLink)
    {
        $this->full_name = $full_name;
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
                    ->view('emails.pre_registration_students_approve_success')
                    ->with([
                        'full_name' => $this->full_name,
                        'passwordResetLink' => $this->passwordResetLink,
                    ]);
    }
}
