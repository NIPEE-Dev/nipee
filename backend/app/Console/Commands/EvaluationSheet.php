<?php

namespace App\Console\Commands;

use App\Beans\MailTask;
use App\Enums\ActiveEnum;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Enums\Document\DocumentTypeTemplateEnum;
use App\Jobs\SendMail;
use App\Mail\EvaluationSheetsNotification;
use App\Models\Contracts\Contract;
use App\Services\Documents\WordProcessor;
use Illuminate\Console\Command;

class EvaluationSheet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contracts:evaluation-sheet';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envia ficha de avaliação para todos contratos ativos';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(WordProcessor $wordProcessor)
    {
        $contracts = Contract::query()
            ->without('originalJob', 'job', 'workingDay', 'company.address', 'candidate.school')
            ->with('company.responsible')
            ->where('status', '=', ActiveEnum::ACTIVE)
            ->get();

        $bcc = config('app.system_identifier') === 'guarulhos' ? 'cadastro@brilhoestagio.com.br' : 'brilholeste@brilhoestagio.com.br';
        foreach ($contracts->groupBy('company.responsible.email') as $email => $contracts) {
            $contractAttachments = [];

            foreach ($contracts as $contract) {
                $candidate = $contract->candidate;
                $company = $contract->company;

                $generatedDocument = $wordProcessor->make(DocumentTypeTemplateEnum::EVALUATION_FORM, [
                    'nomeEstagiario' => $candidate->name,
                    'nomeEmpresa' => $company->corporate_name,
                    'ramoAtividade' => $contract->job->role,
                    'cnpj' => $company->cnpj,
                    'curso' => $candidate->studying_level === StudyingLevelEnum::HIGH_SCHOOL
                        ? StudyingLevelEnum::getLabel($candidate->studying_level)
                        : $candidate->userCourse?->title,
                    'dataInicial' => $contract->start_contract_vigence->format("d/m/Y"),
                    'dataTermino' => $contract->end_contract_vigence->format("d/m/Y"),
                    'mes' => now()->translatedFormat('F'),
                    'ano' => date('Y'),
                ]);

                $fileData = [
                    'filename' => $generatedDocument['randomName'],
                    'original_filename' => $candidate->name . ' - ' . $generatedDocument['filename'],
                    'file_extension' => 'docx',
                    'filesize' => $generatedDocument['filesize'],
                    'type' => 'Ficha de avaliação',
                ];

                $contract->documents()->create($fileData);

                $contractAttachments[] = [
                    'path' => $generatedDocument['path'],
                    'name' => $candidate->name . '.docx'
                ];
            }

            SendMail::dispatch(
                new MailTask(
                    $email,
                    new EvaluationSheetsNotification($contractAttachments),
                    $bcc
                )
            );
        }

        return self::SUCCESS;
    }
}
