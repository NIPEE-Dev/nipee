<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationStudentSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $fullName; 

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $companyName
     * @param string $representativeName
     */
    public function __construct($companyName)
    {
        $this->fullName = $companyName;
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Pré-Registo Enviado com Sucesso')  
                    ->view('emails.pre_registration_students_success') 
                    ->with([
                        'fullName' => $this->fullName, 

                    ]);
    }
}
