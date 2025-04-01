<?php

namespace App\Jobs;

use App\Beans\MailTask;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var MailTask
     */
    private $task;

    /**
     * Create a new job instance.
     *
     * @param MailTask $task
     */
    public function __construct(MailTask $task)
    {
        $this->task = $task;
    }

    /**
     * Execute the job.
     * @return void
     * @throws Exception
     */
    public function handle()
    {
        try {
            $mailable = Mail::to($this->task->getTo());

            if ($bcc = $this->task->getBcc()) {
                $mailable->bcc($bcc);
            }

            $mailable
                ->send($this->task->getMail());
        } catch (Exception $e) {
        }
    }
}
