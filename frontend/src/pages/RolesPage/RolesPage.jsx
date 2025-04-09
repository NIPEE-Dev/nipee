import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { RolesForm as Form } from '../../forms/RolesForm/RolesForm';
import routes from '../../routes';
import { dateFormatter } from '../../utils/visualization';

const RolesPage = () => (
  <ResourceScreen
    title='Lista de Perfis'
    permissions={['']}
    resource='Roles'
    routeBase={routes.config.roles}
    Form={Form}
    resourceNewProps={{
      wrapped: true
    }}
    resourceListProps={{
      wrapped: true
    }}
    resourceUpdateProps={{
      wrapped: true
    }}
    resourceDetailsProps={{
      wrapped: true
    }}
    columns={[
      {
        Header: 'Nome',
        accessor: 'title'
      },
      {
        Header: 'Criado em',
        accessor: (originalData) =>
          dateFormatter(
            originalData.created_at,
            'DD/MM/YYYY HH:mm:ss',
            'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
          )
      },
      {
        Header: 'Atualizado em',
        accessor: (originalData) =>
          dateFormatter(
            originalData.updated_at,
            'DD/MM/YYYY HH:mm:ss',
            'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
          )
      }
    ]}
  />
);

export default RolesPage;
