<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AcceptInterviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public $candidate;
    public $schedule;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($candidate, $schedule)
    {
        $this->candidate = $candidate;
        $this->schedule = $schedule;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Convite de entrevista aceito - NIPEE',
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
            view: 'emails.jobs.interview.accepted',
            with: [
                'candidate' => $this->candidate,
                'schedule' => $this->schedule,
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
