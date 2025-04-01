<?php

namespace App\Beans;

use Illuminate\Mail\Mailable;

class MailTask
{
    /**
     * @var string
     */
    private $to;

    /**
     * @var Mailable
     */
    private $mail;

    private ?string $bcc;

    public function __construct(string $to, Mailable $mail, ?string $bcc = null)
    {
        $this->to = $to;
        $this->mail = $mail;
        $this->bcc = $bcc;
    }

    /**
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }

    /**
     * @return Mailable
     */
    public function getMail(): Mailable
    {
        return $this->mail;
    }

    public function getBcc(): ?string
    {
        return $this->bcc;
    }
}
