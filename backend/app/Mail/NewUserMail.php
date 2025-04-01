<?php

namespace App\Mail;

use App\Models\Campaigns;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewUserMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public $subject,
        public $password,
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
                ->subject($this->subject)
                ->markdown('emails.newuser', ['password' => $this->password]);
        } catch (Exception $e) {
            report($e);
        }
    }
}
