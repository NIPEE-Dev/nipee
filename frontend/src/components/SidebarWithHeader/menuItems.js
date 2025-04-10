import {
  MdNotificationsNone,
  MdOutlineAddBusiness,
  MdOutlineDashboard,
  MdOutlineDocumentScanner,
  MdOutlineFilePresent,
  MdOutlineFolderShared,
  MdOutlineMonetizationOn,
  MdOutlinePersonSearch,
  MdOutlineSettings,
  MdOutlineTextSnippet,
  MdAssignmentInd 
} from 'react-icons/md';
import routes from '../../routes';

const userProfile = JSON.parse(localStorage.getItem('profile'));
const userRole = userProfile?.role || '';
const isAdm = userRole === "Administrador Geral";
const isEmpresa = userRole === "Empresa";
const isEscola = userRole === "Escola";
const isCandidato = userRole === "Candidato";

export const menuItems = [
  { 
    name: 'Relatórios Empresa', 
    icon: MdOutlineDashboard, 
    to: '/dashboard-companies' ,
    permission: 'companies.index'
  },
  { 
    name: 'Relatórios Escola', 
    icon: MdOutlineDashboard, 
    to: '/dashboard-schools' ,
    permission: 'schools.index'
  },
  {
    name: 'Dados do seguro',
    icon: MdOutlineDocumentScanner,
    to: routes.insuranceSettings.list,
    permission: 'insurance-settings.index'
  },

  isAdm 
    ? {
        name: 'Registos',
        icon: MdOutlineAddBusiness,
        children: [
          {
            name: 'Empresas',
            to: routes.companies.list,
            permission: 'companies.index'
          },
          {
            name: 'Escolas',
            to: routes.schools.list,
            permission: 'schools.index'
          },
          {
            name: 'Candidatos',
            to: routes.candidates.list,
            permission: 'candidates.index'
          }
        ]
      }
    : isEmpresa
    ? {
        name: 'Registo',
        icon: MdOutlineAddBusiness,
        children: [
          {
            name: 'Meu Registo',
            to: routes.companies.list,
            permission: 'companies.index'
          },
          {
            name: 'Candidatos',
            to: routes.candidates.list,
            permission: 'candidates.index'
          }
        ]
      }
    : isEscola
    ? {
        name: 'Registo',
        icon: MdOutlineAddBusiness,
        children: [
          {
            name: 'Meu Registo',
            to: routes.schools.list, 
            permission: 'schools.index'
          },
          {
            name: 'Candidatos',
            to: routes.candidates.list,
            permission: 'candidates.index'
          }
        ]
      }
    : isCandidato
    ? {
        name: 'Registo',
        icon: MdOutlineAddBusiness,
        children: [
          {
            name: 'Meu Registo',
            to: routes.candidates.list,
            permission: 'candidates.index'
          }
        ]
      }
    : {
        name: 'Registos',
        icon: MdOutlineAddBusiness,
        children: [
          {
            name: 'Empresas',
            to: routes.companies.list,
            permission: 'companies.index'
          },
          {
            name: 'Escolas',
            to: routes.schools.list,
            permission: 'schools.index'
          },
          {
            name: 'Candidatos',
            to: routes.candidates.list,
            permission: 'candidates.index'
          }
        ]
      },
  {
    name: 'Vagas',
    icon: MdOutlinePersonSearch,
    to: routes.jobs.list,
    permission: 'jobs.index'
  },
  {
    name: 'Protocolos',
    icon: MdOutlineFolderShared,
    to: routes.contracts.list,
    permission: 'contracts.index'
  },
  {
    name: 'Documentos',
    icon: MdOutlineFilePresent,
    to: routes.documents.list,
    permission: 'documents.index'
  },
  {
    name: 'Registos Base',
    icon: MdOutlineTextSnippet,
    to: routes.baseRecords.list,
    permission: 'base-records.index'
  },
/*   {
    name: 'Fechamento',
    icon: MdOutlineMonetizationOn,
    to: routes.financial.close.list,
    permission: [
      'financial-close.index',
      'financial-close.commission-all',
      'financial-close.commission-me'
    ]
  }, */
  {
    name: 'Aprovação',
    icon: MdAssignmentInd ,
    children: [
      {
        name: 'Candidatos',
        to: routes.workflow.candidatos.list,
        permission: 'workflowCandidatos.index'
      },
      {
        name: 'Empresas',
        to: routes.workflow.empresas.list,
        permission: 'workflowEmpresas.index'
      }
    ]
  },
  {
    name: 'Gerenciamento',
    icon: MdOutlineSettings,
    children: [
      {
        name: 'Usuários',
        to: routes.config.users.list,
        permission: 'users.index'
      },
      {
        name: 'Perfis administrativos',
        to: routes.config.roles.list,
        permission: 'roles.index'
      },
      {
        name: 'Relatório de Atividade',
        to: routes.config.report.list,
        permission: 'roles.index'
      }
    ]
  }
];
