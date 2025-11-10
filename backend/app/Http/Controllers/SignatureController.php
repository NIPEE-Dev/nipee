<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Contracts\Contract;
use App\Models\Document;
use PhpOffice\PhpWord\TemplateProcessor;
use Exception;
use App\Mail\SignaturePending;
use Illuminate\Support\Facades\Mail;

class SignatureController extends Controller
{
    public function uploadSignatureCompany(Request $request, $contractId)
    {
        return $this->uploadSignature($request, $contractId, 'empresa', 'company_signature_path', 'company_signature');
    }

    public function uploadSignatureSchool(Request $request, $contractId)
    {
        return $this->uploadSignature($request, $contractId, 'escola', 'school_signature_path', 'school_signature');
    }

    private function uploadSignature(Request $request, $contractId, $type, $pathColumn, $booleanColumn)
    {
        try {
            Log::info("Iniciando upload de assinatura para o contrato: {$contractId}");

            $validTypes = ['empresa', 'escola'];
            if (!in_array($type, $validTypes)) {
                return response()->json(['error' => 'Tipo de assinatura inválido'], 400);
            }

            $contract = Contract::find($contractId);
            if (!$contract) {
                return response()->json(['error' => 'Contrato não encontrado.'], 404);
            }

            if (!$request->has('signature')) {
                return response()->json(['error' => 'Nenhuma assinatura recebida.'], 400);
            }

            $signatureData = $request->input('signature');
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $signatureData));
            if ($imageData === false) {
                return response()->json(['error' => 'Falha ao processar a assinatura.'], 400);
            }

            $directory = "public/assinaturas/{$type}";
            Storage::makeDirectory($directory);

            $fileName = "signature_{$contractId}.png";
            $path = "{$directory}/{$fileName}";
            Storage::put($path, $imageData);

            $contract->$pathColumn = Storage::url($path);
            $contract->$booleanColumn = true;
            $contract->save();

            return $this->insertSignatureIntoContract($contractId, $type);
        } catch (Exception $e) {
            Log::error("Erro ao processar assinatura para o contrato {$contractId}: {$e->getMessage()}");
            return response()->json(['error' => 'Erro interno ao processar a assinatura.'], 500);
        }

        if ($type == "empresa") {
            $school = $contract->school;
            Mail::to($school->email)->send(new SignaturePending(
                $contract->candidate->name,
                $contract->company->corporate_name,
                $contract->company->responsible->name
            ));
        }
    }

    private function insertSignatureIntoContract($contractId, $type)
    {
        try {
            $contract = Contract::find($contractId);
            $document = Document::where('attachable_id', $contractId)->where('attachable_type', Contract::class)->first();
            if (!$document) {
                return response()->json(['error' => 'Documento não encontrado.'], 404);
            }

            $originalFileName = $document->filename;
            $originalFileExtension = $document->file_extension;
            if (strtolower($originalFileExtension) !== 'docx') {
                return response()->json(['error' => 'Arquivo inválido. Somente documentos .docx são permitidos.'], 400);
            }

            $originalPath = storage_path("app/generated_documents/guarulhos/{$originalFileName}.{$originalFileExtension}");

            if (!file_exists($originalPath)) {
                return response()->json(['error' => 'Contrato original não encontrado.'], 404);
            }

            $assinaturaEmpresa = storage_path("app/public/assinaturas/empresa/signature_{$contractId}.png");
            $assinaturaEscola = storage_path("app/public/assinaturas/escola/signature_{$contractId}.png");

            if ($type == 'empresa' && file_exists($assinaturaEmpresa)) {
                $word = new TemplateProcessor($originalPath);
                $word->setImageValue('assinaturaEmpresa', [
                    'path' => $assinaturaEmpresa,
                    'width' => 100,
                    'height' => 50,
                ]);
                $document->status = 4;
            } elseif ($type == 'escola' && file_exists($assinaturaEscola)) {
                $word = new TemplateProcessor($originalPath);
                $word->setImageValue('assinaturaEscola', [
                    'path' => $assinaturaEscola,
                    'width' => 200,
                    'height' => 100,
                ]);
                $document->status = 5;
            } else {
                return response()->json(['error' => 'Assinatura não encontrada.'], 400);
            }

            $word->saveAs($originalPath);

            $document->save();

            return response()->json([
                'message' => 'Contrato assinado com sucesso!',
                'signed_contract' => Storage::url("generated_documents/guarulhos/{$originalFileName}.{$originalFileExtension}")
            ]);
        } catch (Exception $e) {
            Log::error("Erro ao inserir assinatura no contrato {$contractId}: {$e->getMessage()}");
            return response()->json(['error' => 'Erro ao inserir assinatura no contrato.'], 500);
        }
    }
}
