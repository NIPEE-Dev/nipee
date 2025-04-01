<?php

namespace App\API\Payment;

class Client
{
    private \GuzzleHttp\Client $client;

    public function __construct($params)
    {
        $this->client = new \GuzzleHttp\Client($params);
    }

    public function __call($method, $args)
    {
        return $this->client->{$method}(...$args)->getBody()->jsonSerialize();
    }
}