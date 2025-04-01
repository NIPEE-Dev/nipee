<?php

namespace App\Exceptions;

use App\Enums\AlertTypeEnum;
use Exception;

class ApplicationException extends Exception
{
    public function __construct(public $message, public AlertTypeEnum $type = AlertTypeEnum::ERROR, public $status_code = 422)
    {
        parent::__construct($message ?? 'Ocorreu um erro.', $status_code);
    }

    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        //
    }

    /**
     * Report the exception.
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request)
    {
        return response()->json(
            [
                'alert' => [
                    'type' => $this->type->value,
                    'message' => $this->message
                ],
            ],
            $this->status_code,
        );
    }
}
