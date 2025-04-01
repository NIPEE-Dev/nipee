<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistrationStudentsReject extends Mailable
{
    use Queueable, SerializesModels;

    public $fullName; 
    public $rejectionReason; 

    /**
     * Criar uma nova instância de mensagem.
     *
     * @param string $companyName
     * @param string $representativeName
     * @param string $rejectionReason
     */
    public function __construct($fullName, $rejectionReason)
    {
        $this->fullName = $fullName;
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
                    ->view('emails.pre_registration_students_reject') 
                    ->with([
                        'companyName' =>  $this->fullName, 
                        'rejectionReason' => $this->rejectionReason, 
                    ]);
    }
}
