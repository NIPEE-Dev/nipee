<?php

namespace App\Http\Requests\BaseRercords;

use App\Enums\BaseRecordsEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rules\In;

class UpdateBaseRecordRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'type' => ['sometimes', 'numeric', 'in' => new In(Arr::pluck(BaseRecordsEnum::cases(), 'value'))],
            'title' => 'sometimes|required|string|min:2|max:255'
        ];
    }
}
