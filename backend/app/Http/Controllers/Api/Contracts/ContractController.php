<?php

namespace App\Http\Controllers\Api\Contracts;

use App\Enums\ActiveEnum;
use App\Enums\AlertTypeEnum;
use App\Exceptions\ApplicationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\Contracts\ContractDataResource;
use App\Http\Resources\Contracts\ContractResource;
use App\Models\Candidate;
use App\Models\Contracts\Contract;
use App\Models\Document;
use App\Models\Jobs\Job;
use App\Services\ContractService;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContractController extends Controller
{
    public function __construct(public ContractService $contractService)
    {
    }

    public function index(FilterRequest $request): AnonymousResourceCollection
    {
        return ContractResource::collection($this->contractService->index($request->all()));
    }

    public function show(Contract $contract): ContractResource
    {
        return new ContractResource($contract->load(['userAddress', 'jobOtherAddress', 'candidate.contact', 'school', 'documents']));
    }

    public function store(Request $request): ContractResource
    {
        return new ContractResource($this->contractService->store($request->all()));
    }

    public function update(Contract $contract, Request $request): ContractResource
    {
        if (!$contract->isActive()) {
            throw new ApplicationException("Contrato inativo não pode ser atualizado", AlertTypeEnum::WARNING);
        }

        return new ContractResource($this->contractService->update($contract, $request->all()));
    }

    public function loadContractData(Job $job, Candidate $candidate): ContractDataResource
    {
        if ($candidate->hasActiveContract()) {
            throw new ApplicationException("Este candidato já possuí contrato ativo");
        }

        $candidate->load('contact', 'school');
        $job->load('workingDay', 'company.address', 'role');

        return new ContractDataResource(compact('candidate', 'job'));
    }

    /**
     * @throws FileNotFoundException
     */
    public function download($file): StreamedResponse
    {
        $attach = Document::query()->whereRaw('CONCAT(filename, ".", file_extension) = ?', $file)->first();

        if (!$attach) {
            throw new FileNotFoundException("Arquivo não encontrado");
        }

        $paste = "generated_documents/" . config('app.system_identifier') . "/$file";
        $path = storage_path("app/$paste");
        if (!File::exists($path)) {
            throw new FileNotFoundException("Arquivo não encontrado");
        }

        return Storage::disk('local')->download($paste, $attach->original_filename . '.' . $attach->file_extension);
    }

    /**
     * @throws ApplicationException
     */
    public function destroy(Request $request, Contract $contract): ContractResource|JsonResponse
    {
        $motive = $request->get('motive');
        $payCurrentMonth = (bool)$request->get('payCurrentMonth');
        $terminatedAt = $request->get('terminatedAt');
        $terminationPin = $request->get('terminationPin');
        $pin = config('brilho.termination_pin');

        if ($request->has('delete_full')) {
            if ($pin !== $terminationPin) {
                throw new ApplicationException("Senha informada incorreta", AlertTypeEnum::ERROR);
            }

            $contract->tax()->delete();
            $contract->update(['status' => ActiveEnum::NOT_ACTIVE]);
            return response()->json(['deleted' => $contract->delete()]);
        }

        if (!$request->has('reactive') && (!$motive || strlen($motive) <= 0 || !$terminatedAt)) {
            throw new ApplicationException("Preencha os campos corretamente", AlertTypeEnum::WARNING);
        }

        if ($request->has('reactive') && $pin !== $terminationPin) {
            throw new ApplicationException("Senha informada incorreta", AlertTypeEnum::ERROR);
        }

        $this->contractService->destroy($contract, $motive, $payCurrentMonth, $terminatedAt);
        return new ContractResource($contract);
    }
}