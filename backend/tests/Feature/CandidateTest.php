<?php


use App\Models\Candidate;
use Tests\TestCase;

class CandidateTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->setBaseRoute('candidates');
        $this->setBaseModel(Candidate::class);
    }

    public function test_users_list_can_be_accessed()
    {
        $this->list();
    }

    public function test_can_create_user()
    {
        $this->create();
    }

    public function test_can_update_user()
    {
        $this->update([
            'name' => 'Everton Neri',
            'email' => 'evertonneri@outlook.com'
        ]);
    }

    public function test_can_delete_user()
    {
        $this->destroy();
    }
}
