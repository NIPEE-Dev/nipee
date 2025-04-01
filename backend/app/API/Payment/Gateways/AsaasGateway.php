<?php

namespace App\API\Payment\Gateways;

use App\API\Payment\Client;
use App\API\Payment\Stream\JsonStream;
use App\Models\Company\Company;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\RequestOptions;
use Psr\Http\Message\ResponseInterface;

class AsaasGateway implements IPaymentGateway
{
    private Client $client;
    private Company $company;

    public function __construct(Company $company)
    {
        $this->company = $company;
        $this->boot();
    }

    private function boot()
    {
        $stack = HandlerStack::create();

        $stack->push(Middleware::mapResponse(function (ResponseInterface $response) {
            return $response->withBody(new JsonStream($response->getBody()));
        }));

        $this->client = new Client([
            'handler' => $stack,
            'http_errors' => false,
            'base_uri' => config('payment_gateways.gateways.asaas.environment') === 'dev'
                ? config('payment_gateways.gateways.asaas.base_url_sandbox')
                : config('payment_gateways.gateways.asaas.base_url_production'),
            'headers' => [
                'access_token' => config('payment_gateways.gateways.asaas.api_key'),
                'Accept' => 'application/json'
            ]
        ]);

        $this->ensureCompanyHasAsaasAccount();
    }

    private function ensureCompanyHasAsaasAccount()
    {
        if (!$this->company->hasAsaasId()) {
            $this->createClient();
        }
    }

    private function createClient()
    {
        $asaasId = $this->client->post('customers', [
            RequestOptions::JSON => [
                'name' => $this->company->corporate_name,
                'cpfCnpj' => preg_replace('/\D/', '', $this->company->cnpj ?? $this->company->cpf),
                'email' => $this->company->responsible->email,
                'externalReference' => $this->company->id,

                'postalCode' => preg_replace('/\D/', '', $this->company->address->cep),
                'addressNumber' => $this->company->address->number,
            ]
        ]);

        $this->company->update([
            'asaas_id' => $asaasId->id
        ]);
    }

    public function createBilling()
    {
        return $this->client->get('payments');
    }
}
