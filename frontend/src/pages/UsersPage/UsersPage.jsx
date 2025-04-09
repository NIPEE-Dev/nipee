import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { UsersForm as Form } from '../../forms/UsersForm/UsersForm';
import routes from '../../routes';

const UsersPage = () => (
  <ResourceScreen
    title='Lista de Utilizadores'
    permissions={['']}
    resource='Users'
    routeBase={routes.config.users}
    Form={Form}
    resourceNewProps={{
      wrapped: true,
    }}
    resourceListProps={{
      wrapped: true,
    }}
    resourceUpdateProps={{
      wrapped: true,
    }}
    resourceDetailsProps={{
      wrapped: true,
    }}
    columns={[
      {
        Header: 'ID',
        accessor: 'id', 
      },
      {
        Header: 'Nome de usuário',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ]}
  />
);

export default UsersPage;
