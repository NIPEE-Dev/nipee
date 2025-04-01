import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { InsuranceSettingsForm as Form } from '../../forms/InsuranceSettingsForm/InsuranceSettingsForm';
import routes from '../../routes';
import { dateFormatter } from '../../utils/visualization';

const InsuranceSettingsPage = () => (
  <ResourceScreen
    title='Configurações do Seguro'
    permissions={['']}
    resource='InsuranceSettings'
    routeBase={routes.insuranceSettings}
    Form={Form}
    canAdd={false}
    canRemove={false}
    canView={false}
    resourceListProps={{
      listTableProps: {
        disablePagination: true,
      },
    }}
    columns={[
      {
        Header: 'Atualizado em',
        accessor: (originalData) =>
          dateFormatter(
            originalData.updated_at,
            'DD-MM-YYYY HH:mm:ss',
            'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
          ),
      },
      {
        Header: 'Apólice',
        accessor: 'apolice',
      },
      {
        Header: 'Subestipulante',
        accessor: 'subestipulante',
      },
    ]}
  />
);

export default InsuranceSettingsPage;
