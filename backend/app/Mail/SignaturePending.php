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

    public $studentName;
    public $companyName;
    public $representativeName;

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

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Assinatura Pendente - Protocolo de ' . $this->studentName,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.signature_pending',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}