<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CompletedFctHoursMail extends Mailable
{
    use Queueable, SerializesModels;

    public $responsible;
    public $schoolName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($responsible, $schoolName)
    {
        $this->responsible = $responsible;
        $this->schoolName = $schoolName;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Avaliação do aluno em Formação em Contexto de Trabalho',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.completed_fct_hours',
            with: [
                'responsible' => $this->responsible,
                'schoolName' => $this->schoolName,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
