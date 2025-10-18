<?php

namespace App\Http\Controllers\Api\Shared;

use App\Enums\AlertTypeEnum;
use App\Enums\Document\DocumentStatusEnum;
use App\Exceptions\ApplicationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadSignedContractRequest;
use App\Http\Resources\DocumentsResource;
use App\Models\Document;
use App\Services\Documents\DocumentsService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class DocumentsController extends Controller
{
    public function __construct(private readonly DocumentsService $documentsService) {}

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
        /* $pin = config('brilho.termination_pin');
        $terminationPin = $request->get('pin');

        if ($pin !== $terminationPin) {
            throw new ApplicationException("Senha informada incorreta", AlertTypeEnum::ERROR);
        }*/

        $document->delete();
        return new DocumentsResource($document);
    }

    public function updateSignedContract(UploadSignedContractRequest $request, Document $document)
    {
        $file = $request->file('file');
        $fileName = uniqid();
        $fileExtension = $file->getClientOriginalExtension();
        Storage::disk('local')->put('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension, file_get_contents($file));

        $document->filename = $fileName;
        $document->original_filename = $file->getClientOriginalName();
        $document->file_extension = $fileExtension;
        $document->filesize = Storage::disk('local')->size('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension);
        $document->status = DocumentStatusEnum::SENT;
        $document->save();
        return $document;
    }
}
