<?php

namespace App\View\Components\Forms;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

/**
 * Class Select
 * @package App\View\Components\Forms
 */
class Select extends Component
{
    /**
     * @var
     */
    public $id;

    /**
     * @var string
     */
    public $label;

    /**
     * @var Collection
     */
    public $options;

    /**
     * @var array
     */
    public $text;

    /**
     * @var array
     */
    public $selected;

    /**
     * Create a new component instance.
     *
     * @param string $label
     * @param Collection $options
     * @param string $text
     * @param string $selected
     */
    public function __construct(string $label, Collection $options = null, string $text = '', string $selected = '')
    {
        $this->id = uniqid();
        $this->label = $label;
        $this->options = $options;
        $this->text = explode(',', $text);
        $this->selected = explode(',', $selected);
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.select');
    }
}
