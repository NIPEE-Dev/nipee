<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SignaturePending extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($studentName, $companyName, $representativeName)
    {
        $this->studentName = $studentName;
        $this->companyName = $companyName;
        $this->representativeName = $representativeName;
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function build()
    {
        return $this->subject('Assinatura Pendente - Protocolo de ' . $this->studentName)
            ->view('emails.signature_pending')
            ->with([
                'studentName' => $this->studentName,
                'companyName' => $this->companyName,
                'representativeName' => $this->representativeName,
            ]);
    }
}
