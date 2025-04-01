<?php

namespace Contracts;

use App\Models\Contracts\Contract;
use Tests\TestCase;

class ContractsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->setBaseRoute('contracts');
        $this->setBaseModel(Contract::class);
    }

    public function test_contract_list_can_be_accessed()
    {
        $this->list();
    }

    public function test_can_create_contract()
    {
        $this->create();
    }
}
