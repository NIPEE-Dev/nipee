<?php

namespace App\Mail;

use App\Models\Campaigns;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class EvaluationSheetsNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public array $contractAttachments,
    )
    {
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        try {
            return $this
                ->subject("Ficha de avaliação")
                ->markdown('emails.evaluation-sheet');
        } catch (Exception $e) {
            report($e);
        }
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return array_map(fn($attachment) => Attachment::fromPath($attachment['path'])
            ->as($attachment['name'])
            ->withMime('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            , $this->contractAttachments);
    }
}
