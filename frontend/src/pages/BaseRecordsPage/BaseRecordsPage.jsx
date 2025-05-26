import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { BaseRecordsForm as Form } from '../../forms/BaseRecordsForm/BaseRecordsForm';
import routes from '../../routes';

const BaseRecordsPage = () => (
  <ResourceScreen
    title='Registos Base'
    permissions={['']}
    resource='BaseRecords'
    routeBase={routes.baseRecords}
    Form={Form}
    columns={[
      /* {
        Header: 'ID',
        accessor: 'id',
      }, */
      {
        Header: 'Tipo',
        accessor: 'type_title',
      },
      {
        Header: 'Titulo',
        accessor: 'title',
      },
    ]}
    filters={[
      {
        field: 'type',
        header: 'Tipo',
        type: 'select',
        options: [
          { value: 1, header: 'Funções' },
          { value: 2, header: 'Como nos conheceu' },
          { value: 3, header: 'Motivo de rescisão' },
          { value: 4, header: 'Motivos de reprovação' },
          { value: 5, header: 'Feriados' },
          { value: 6, header: 'Cursos' },
          { value: 7, header: 'Cidades' },
        ],
      },
      {
        field: 'title',
        header: 'Titulo',
      },
    ]}
  />
);

export default BaseRecordsPage;
