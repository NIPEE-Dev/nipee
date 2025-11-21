<?php

namespace App\Http\Controllers\Api\Shared;

use App\Enums\AlertTypeEnum;
use App\Enums\Document\DocumentStatusEnum;
use App\Enums\RolesEnum;
use App\Exceptions\ApplicationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadSignedContractRequest;
use App\Http\Resources\DocumentsResource;
use App\Models\Document;
use App\Services\Documents\DocumentsService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();
        $roleId = $user->roles[0]->id;

        $fileName = uniqid();
        $fileExtension = $file->getClientOriginalExtension();
        Storage::disk('local')->put('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension, file_get_contents($file));

        $document->filename = $fileName;
        $document->original_filename = $file->getClientOriginalName();
        $document->file_extension = $fileExtension;
        $document->filesize = Storage::disk('local')->size('generated_documents/' . config('app.system_identifier') . '/' . $fileName . '.' . $fileExtension);
        if ($roleId === RolesEnum::SCHOOL->value) {
            $document->status = DocumentStatusEnum::SIGNARTURE;
            $document->attachable->school_signature = true;
        }

        if ($roleId === RolesEnum::COMPANY->value) {
            $document->status = DocumentStatusEnum::PENDING_SCHOOL_SIGNATURE;
            $document->attachable->company_signature = true;
        }
        $document->save();
        $document->attachable->save();
        return $document;
    }

    public function restartSignedContract(Request $request, Document $document)
    {
        $document->status = DocumentStatusEnum::PENDING_COMPANY_SIGNATURE;
        $document->attachable->school_signature = false;
        $document->attachable->company_signature = false;
        $document->save();
        $document->attachable->save();

        return $document;
    }
}
