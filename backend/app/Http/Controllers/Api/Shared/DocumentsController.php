<?php

namespace App\Http\Controllers\Api\Shared;

use App\Enums\AlertTypeEnum;
use App\Enums\Document\DocumentStatusEnum;
use App\Exceptions\ApplicationException;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentsResource;
use App\Models\Document;
use App\Services\Documents\DocumentsService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DocumentsController extends Controller
{
    public function __construct(private readonly DocumentsService $documentsService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        return DocumentsResource::collection($this->documentsService->index($request->all()));
    }

    public function update(Request $request, Document $document): DocumentsResource
    {
        $status = DocumentStatusEnum::tryFrom($request->post('status'));
        $document->update(['status' => $status ?? DocumentStatusEnum::GENERATED]);

        return new DocumentsResource($document);
    }

    /**
     * @throws ApplicationException
     */
    public function destroy(Request $request, Document $document): DocumentsResource
    {
        $pin = config('brilho.termination_pin');
        $terminationPin = $request->get('pin');

        if ($pin !== $terminationPin) {
            throw new ApplicationException("Senha informada incorreta", AlertTypeEnum::ERROR);
        }

        $document->delete();
        return new DocumentsResource($document);
    }
}