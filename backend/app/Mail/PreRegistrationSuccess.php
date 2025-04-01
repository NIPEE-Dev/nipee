<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $companyName; 
    public $representativeName;  

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $companyName
     * @param string $representativeName
     */
    public function __construct($companyName, $representativeName)
    {
        $this->companyName = $companyName;
        $this->representativeName = $representativeName;
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Pré-Registo Enviado com Sucesso')  
                    ->view('emails.pre_registration_success') 
                    ->with([
                        'companyName' => $this->companyName, 
                        'representativeName' => $this->representativeName,  
                    ]);
    }
}
