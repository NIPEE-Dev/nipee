import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from '../../routes';
import Container from '../Container/Container';
import Login from '../Login/Login';
import ResetPassword from '../ResetPassword/ResetPassword';
import ResetPassword2 from '../ResetPassword/ResetPassword2';
import EmptyResult from '../EmptyResult/EmptyResult';
import ChooseCandidates from '../ChooseCandidates/ChooseCandidates';
import PermissionRoute from '../Permission/PermissionRoute';
import { UsersPage } from '../../pages/UsersPage';
import { CompaniesPage } from '../../pages/CompaniesPage';
import { SchoolsPage } from '../../pages/SchoolsPage';
import { CandidatesPage } from '../../pages/CandidatesPage';
import { BaseRecordsPage } from '../../pages/BaseRecordsPage';
import { JobsPage } from '../../pages/JobsPage';
import { ContractsPage } from '../../pages/ContractsPage';
import { FinancialClosePage } from '../../pages/FinancialClosePage';
import { InsuranceSettingsPage } from '../../pages/InsuranceSettingsPage';
import { RolesPage } from '../../pages/RolesPage';
import { DocumentsPage } from '../../pages/DocumentsPage';
import { WorkflowCandidatesPage } from '../../pages/WorkflowCandidatesPage';
import { WorkflowCompaniesPage } from '../../pages/WorkflowCompaniesPage';
import { DashboardCompanies } from '../../pages/DashboardCompanies';
import Inicio from '../../pages/Inicio/Inicio.jsx';
import Termos from '../../pages/Termos/Termos.jsx';
import DashboardSchools from '../../pages/DashboardSchools/DashboardSchools.jsx';
import ActivityReport from '../../pages/ActivityReport/ActivityReport.jsx';
import ReportsFCT from '../../pages/ReportsFCT/ReportsFCT.jsx';
import AvaliacaoFCT from '../../pages/AvaliacaoFCT/AvaliacaoFCT.jsx';
import JobDetails from '../../pages/JobsPage/JobDetails.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/termos-condicoes-uso" element={<Termos />} />
      <Route path={routes.auth.login} element={<Login />} />
      <Route path={routes.resetPassword} element={<ResetPassword />} />
      <Route path={routes.recuperaSenha} element={<ResetPassword2 />} />
      <Route path='logged' element={<Navigate to='/' />} />
      <Route path='/' element={<Container />}> 
        <Route path='config/*'>
          <Route
            path='users/*'
            element={
              <PermissionRoute permission='users.index'>
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path='roles/*'
            element={
              <PermissionRoute permission='roles.index'>
                <RolesPage />
              </PermissionRoute>
            }
          />
          <Route
            path='system-activity/*'
            element={
              <PermissionRoute permission='roles.index'>
                <ActivityReport />
              </PermissionRoute>
            }
          />
        </Route>
        <Route path='financial/*'>
          <Route
            path='close/*'
            element={
              <PermissionRoute
                permission={[
                  'financial-close.index',
                  'financial-close.commission-all',
                  'financial-close.commission-me'
                ]}
              >
                <FinancialClosePage />
              </PermissionRoute>
            }
          />
        </Route>
        <Route
          path='companies/*'
          element={
            <PermissionRoute permission='companies.index'>
              <CompaniesPage />
            </PermissionRoute>
          }
        />
        <Route
          path='schools/*'
          element={
            <PermissionRoute permission='schools.index'>
              <SchoolsPage />
            </PermissionRoute>
          }
        />
        <Route
          path='dashboard-companies/*'
          element={
            <PermissionRoute permission='companies.index'>
              <DashboardCompanies />
            </PermissionRoute>
          }
        />
        <Route
          path='dashboard-schools/*'
          element={
            <PermissionRoute permission='schools.index'>
              <DashboardSchools />
            </PermissionRoute>
          }
        />
        <Route
          path='reports-fct/*'
          element={
            <PermissionRoute permission='reportsCandidates.index'>
              <ReportsFCT />
            </PermissionRoute>
          }
        />
        <Route
          path='evaluation-fct/*'
          element={
            <PermissionRoute permission='evaluationCandidates.index'>
              <AvaliacaoFCT />
            </PermissionRoute>
          }
        />
        <Route
          path='insurance-settings/*'
          element={
            <PermissionRoute permission='insurance-settings.index'>
              <InsuranceSettingsPage />
            </PermissionRoute>
          }
        />
        <Route
          path='candidates/*'
          element={
            <PermissionRoute permission='candidates.index'>
              <CandidatesPage />
            </PermissionRoute>
          }
        />
        <Route
          path='jobs-candidate/:jobId'
          element={
            <PermissionRoute permission='jobs.index'>
              <JobDetails />
            </PermissionRoute>
          }
        />
        <Route path='jobs/*'>
          <Route
            path='choose-candidate/*'
            element={
              <PermissionRoute permission='jobs.index'>
                <ChooseCandidates />
              </PermissionRoute>
            }
          />
          <Route
            path='*'
            element={
              <PermissionRoute permission='jobs.index'>
                <JobsPage />
              </PermissionRoute>
            }
          />
        </Route>
        <Route
          path='base-records/*'
          element={
            <PermissionRoute permission='base-records.index'>
              <BaseRecordsPage />
            </PermissionRoute>
          }
        />
        <Route
          path='contracts/*'
          element={
            <PermissionRoute permission='contracts.index'>
              <ContractsPage />
            </PermissionRoute>
          }
        />
        <Route
          path='documents/*'
          element={
            <PermissionRoute permission='documents.index'>
              <DocumentsPage />
            </PermissionRoute>
          }
        />
        <Route
          path='workflow/candidate/*'
          element={
            <PermissionRoute permission='workflowCandidatos.index'>
              <WorkflowCandidatesPage />
            </PermissionRoute>
          }
        />
        <Route
          path='workflow/company/*'
          element={
            <PermissionRoute permission='workflowEmpresas.index'>
              <WorkflowCompaniesPage />
            </PermissionRoute>
          }
        />
        <Route path='*' element={<EmptyResult />} />
      </Route>
    </Routes>
  );
}

export default App;
