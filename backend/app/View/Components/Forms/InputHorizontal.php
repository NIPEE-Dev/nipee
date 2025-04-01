<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

/**
 * Class InputHorizontal
 * @package App\View\Components\Forms
 */
class InputHorizontal extends Component
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
     * @var bool
     */
    public $group;

    /**
     * InputHorizontal constructor.
     * @param string $name
     * @param string $label
     * @param bool $group
     */
    public function __construct(string $name, string $label, bool $group)
    {
        $this->id = uniqid();
        $this->name = $name;
        $this->label = $label;
        $this->group = $group;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.input-horizontal');
    }
}
