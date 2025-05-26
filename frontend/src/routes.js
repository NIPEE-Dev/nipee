import createResourceRoute from './store/utils/createResourceRoute';

const userProfile = JSON.parse(localStorage.getItem('profile'));

export default {
  auth: {
  login: '/login',
    register: '/register'
  },

  resetPassword: '/redefinir-senha',
  recuperaSenha: '/recupera-senha',

  dashboardCompanies: '/dashboard-companies',
  dashboardCompanies: '/dashboard-schools',
  companies: createResourceRoute('companies'),
  insuranceSettings: createResourceRoute('insurance-settings'),
  candidates: {
    ...createResourceRoute('candidates'),
    self: `/candidates/view/${userProfile.candidate_id}`
  },
  schools: createResourceRoute('schools'),
  jobs: createResourceRoute('jobs'),
  jobsChooseCandidates: '/jobs/choose-candidate',
  baseRecords: createResourceRoute('base-records'),
  contracts: createResourceRoute('contracts'),
  documents: createResourceRoute('documents'),
  reports: {
    candidates: {
      list: "reports/candidates",
      index: "reports/candidates/*",
    }
  },
  config: {
    users: createResourceRoute('users', 'config'),
    roles: createResourceRoute('roles', 'config'),
    report: {
      list: 'config/system-activity',
      index: 'config/system-activity/*'
    }
  },

  workflow: {
    candidatos: createResourceRoute('candidate', 'workflow'),
    empresas: createResourceRoute('company', 'workflow')
  },

  financial: {
    close: createResourceRoute('close', 'financial')
  }
};
