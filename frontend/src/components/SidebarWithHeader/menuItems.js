import {
  MdNotificationsNone,              
  MdOutlineAddBusiness,             // 🏢 Usado em: Registos, Registo
  MdOutlineDashboard,               // 📊 Usado em: Relatórios Empresa, Relatórios Escola
  MdOutlineDocumentScanner,         // 📄 Usado em: Dados do seguro
  MdOutlineFilePresent,             // 📁 Usado em: Documentos
  MdOutlineFolderShared,            // 🗂️ Usado em: Protocolos
  MdOutlineMonetizationOn,          // 💰 Comentado: Fechamento
  MdOutlinePersonSearch,            // 👤 Usado em: Vagas
  MdOutlineSettings,                // ⚙️ Usado em: Gestão
  MdOutlineTextSnippet,             // 📝 Usado em: Registos Base
  MdAssignmentInd,                  // ✅ Usado em: Aprovação
  MdMenu                            // 📋 Usado em: container do menu principal
} from 'react-icons/md';
import { FaSchool  } from "react-icons/fa"; // icon para escola
import routes from '../../routes';

const userProfile = JSON.parse(localStorage.getItem('profile'));
const userRole = userProfile?.role || '';
const isAdm = userRole === "Administrador Geral";
const isEmpresa = userRole === "Empresa";
const isEscola = userRole === "Escola";
const isCandidato = userRole === "Candidato";

export const baseMenuItems = [
  { 
    name: 'Relatórios Empresa', 
    icon: MdOutlineDashboard, 
    to: '/dashboard-companies',
    permission: 'companies.index'
  },
  { 
    name: 'Relatórios Escola', 
    icon: FaSchool, 
    to: '/dashboard-schools',
    permission: 'schools.index'
  },
   { 
    name: 'Relatórios FCT', 
    icon: MdOutlineDashboard, 
    to: '/reports-fct' ,
    permission: 'reportsCandidates.index'
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
                        icon: MdOutlinePersonSearch,
            to: routes.companies.list,
            permission: 'companies.index'
          },
          {
            name: 'Candidatos',
                        icon: MdOutlinePersonSearch,
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
                        icon: MdOutlineAddBusiness,

            to: routes.schools.list,
            permission: 'schools.index'
          },
          {
            name: 'Candidatos',
            to: routes.candidates.list,
                        icon: MdOutlinePersonSearch,

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
            to: routes.candidates.self,
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
   // Descomente se tiver suporte a arrays em permission
  // {
  //   name: 'Fechamento',
  //   icon: MdOutlineMonetizationOn,
  //   to: routes.financial.close.list,
  //   permission: [
  //     'financial-close.index',
  //     'financial-close.commission-all',
  //     'financial-close.commission-me'
  //   ]
  // },
  ...((isAdm) ? [
    {
      name: 'Gestão',
      icon: MdOutlineSettings,
      children: [
        {
          name: 'Utilizadores',
          to: routes.config.users.list,
          permission: 'users.index'
        },
        {
          name: 'Configuração de perfis',
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
  ] : []),

  ...((isAdm || isEscola) ? [
    {
      name: 'Aprovação',
      icon: MdAssignmentInd,
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
    }
  ] : []),
];

export const menuItems = [
  {
    name: 'Menu',
    icon: MdMenu,
    children: baseMenuItems
  }
];
