<?php

namespace App\Enums\Document;

enum DocumentTypeTemplateEnum: string
{
    case CONTRACT_INTERNSHIP = 'contratoEstagio';
    case CONTRACT_INTERNSHIP_CPF = 'contratoEstagioCpf';
    case CONTRACT_COMPANY = 'empresaEmpresa'; 
    case CONTRACT_COMPANY_CPF = 'empresaEmpresaCpf';
    case CONTRACT_SCHOOL = 'empresaEscola';
    case TERMINATION = 'rescisao';
    case ADDENDUM = 'modeloAdendo';
    case FORWARDED = 'encaminhamento';
    case EVALUATION_FORM = 'ficha';

    public static function getFilenameByTemplate(self $template)
    {
        return match ($template) {
            self::CONTRACT_INTERNSHIP, self::CONTRACT_INTERNSHIP_CPF => self::appendHour('Protocolo de FCT'),
            self::CONTRACT_COMPANY, self::CONTRACT_COMPANY_CPF => self::appendHour('Protocolo de Empresa'),
            self::CONTRACT_SCHOOL => self::appendHour('Protocolo de Escola'),
            self::TERMINATION => self::appendHour('Rescisão'),
            self::ADDENDUM => self::appendHour('Adendo'),
            self::FORWARDED => self::appendHour('Encaminhamento'),
            self::EVALUATION_FORM => self::appendHour('Ficha de avaliação'),
        };
    }

    private static function appendHour(string $name): string
    {
        return $name . ' - ' . date("d-m-Y His");
    }
}