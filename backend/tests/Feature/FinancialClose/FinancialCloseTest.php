<?php

namespace FinancialClose;

use App\Models\Financial\FinancialClose;
use Tests\TestCase;

class FinancialCloseTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->setBaseRoute('financial-close');
        $this->setBaseModel(FinancialClose::class);
    }

    public function test_financial_closes_list_can_be_accessed()
    {
        $this->list();
    }

    public function test_can_create_financial_close()
    {
        $this->create();
    }
}
