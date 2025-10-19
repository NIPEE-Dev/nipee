<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifyJobApply extends Mailable
{
    use Queueable, SerializesModels;

    public $candidateName;
    public $companyName;
    public $jobName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($candidateName, $companyName, $jobName)
    {
        $this->candidateName = $candidateName;
        $this->companyName = $companyName;
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
            subject: 'Alguém se candidatou na sua vaga',
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
            view: 'emails.jobs.apply',
            with: [
                'jobName' => $this->jobName,
                'companyName' => $this->companyName,
                'candidateName' => $this->candidateName,
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
