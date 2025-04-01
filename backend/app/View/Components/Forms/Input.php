<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

/**
 * Class Input
 * @package App\View\Components\Forms
 */
class Input extends Component
{
    /**
     * @var string
     */
    public $id;

    /**
     * @var string
     */
    public $name;

    /**
     * @var string
     */
    public $label;

    /**
     * Input constructor.
     * @param string $name
     * @param string $label
     */
    public function __construct(string $name, string $label)
    {
        $this->id = uniqid();
        $this->name = $name;
        $this->label = $label;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.input');
    }
}
