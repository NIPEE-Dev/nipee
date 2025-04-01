<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationRReject extends Mailable
{
    use Queueable, SerializesModels;

    public $companyName; 
    public $representativeName;  
    public $rejectionReason; 

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $companyName
     * @param string $representativeName
     * @param string $rejectionReason
     */
    public function __construct($companyName, $representativeName, $rejectionReason)
    {
        $this->companyName = $companyName;
        $this->representativeName = $representativeName;
        $this->rejectionReason = $rejectionReason; 
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Registo Rejeitado na Plataforma - Motivo Informado')  
                    ->view('emails.pre_registration_reject') 
                    ->with([
                        'companyName' => $this->companyName, 
                        'representativeName' => $this->representativeName,
                        'rejectionReason' => $this->rejectionReason, 
                    ]);
    }
}
