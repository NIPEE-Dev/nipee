<?php

namespace App\Enums;

use Illuminate\Support\Facades\Log;

enum RolesEnum: int
{
  case GENERAL_ADMIN = 1;
  case SELLER = 5;
  case RECRUITMENT_AND_SELECTION = 6;
  case ADMINISTRATIVE = 7;
  case HR_INTERN = 8;
  case ADM_INTERN = 9;
  case SCHOOL = 10;
  case APPROVER_PRE_REGISTER_COMPANY = 11;
  case APPROVER_PRE_REGISTER_CANDIDATE = 12;
  case CANDIDATE = 13;
  case COMPANY = 14;
  case COMPANY_BRANCH = 15;
  case COMPANY_SECTOR = 16;


  public static function getLabel($value)
  {

    return match ($value) {
      RolesEnum::GENERAL_ADMIN => 'Administrador Geral',
      RolesEnum::SELLER => 'Vendedor',
      RolesEnum::RECRUITMENT_AND_SELECTION => 'Recrutamento e Seleção',
      RolesEnum::ADMINISTRATIVE => 'Administrativo',
      RolesEnum::HR_INTERN => 'Estagiária de RH',
      RolesEnum::ADM_INTERN => 'Estagiária de Adm',
      RolesEnum::SCHOOL => 'Escola',
      RolesEnum::APPROVER_PRE_REGISTER_COMPANY => 'Aprovador Pré-Registo Empresa',
      RolesEnum::APPROVER_PRE_REGISTER_CANDIDATE => 'Aprovador Pré-Registo Candidato',
      RolesEnum::CANDIDATE => 'Candidato',
      RolesEnum::COMPANY => 'Empresa',
      RolesEnum::COMPANY_BRANCH => 'Unidade',
      RolesEnum::COMPANY_SECTOR => 'Setor',
      default => 'Permissão desconhecido',
    };
  }
}
