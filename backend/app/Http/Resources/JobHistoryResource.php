<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class JobHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $user = Auth::user();
        $currentCandidate = $this->candidates->where('id', $user->candidate->id ?? null)->first();
        return [
            'id' => $this->id,
            'role' => $this->role,
            'company' => $this->company->corporate_name,
            'appliedAt' => $currentCandidate->pivot->created_at ?? null,
            'status' => $currentCandidate->pivot->status ?? null,
            'interviews' => InterviewInviteResource::collection($this->invites),
        ];
    }
}
