<?php

namespace App\Mail;

use App\Models\Campaigns;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VacationNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public string $name,
        public string $date
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
                ->subject("Aviso de férias")
                ->markdown('emails.vacation', ['name' => $this->name, 'date' => $this->date]);
        } catch (Exception $e) {
            report($e);
        }
    }
}
