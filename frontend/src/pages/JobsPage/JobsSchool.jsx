import React from 'react';
import _map from 'lodash/map';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { JobsForm as Form } from '../../forms/JobsForm/JobsForm';
import routes from '../../routes';

const JobsSchool = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";

  return (
    <ResourceScreen
      title='Vagas'
      permissions={['']}
      resource='Jobs'
      routeBase={routes.config.jobs}
      Form={Form}
      canEdit={!isEscola}
      canAdd={!isEscola}
      canRemove={false}
      canView={false}
      resourceListProps={{
        downloadButtonEnabled: false,
        resourceParams: {
          withoutTrashed: true
        },
        
      }}
      columns={[
        {
          Header: 'Aluno',
          accessor: 'available'
        },
        {
          Header: 'Curso',
          accessor: 'fantasy_name'
        },
        {
          Header: 'Empresa',
          accessor: 'corporate_name'
        },
        {
          Header: 'Status',
          accessor: 'role'
        }
      ]}
    />
  );
};

export default JobsSchool;
