<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobDenied extends Mailable
{
    use Queueable, SerializesModels;

    public $candidate;
    public $jobName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($candidate, $jobName)
    {
        $this->candidate = $candidate;
        $this->jobName = $jobName;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Você foi reprovado',
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
            view: 'emails.jobs.interview.denied',
            with: [
                'candidate' => $this->candidate,
                'jobName' => $this->jobName,
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
