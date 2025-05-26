import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { CandidatesForm as Form } from '../../forms/CandidatesForm/CandidatesForm';
import { Link } from '@chakra-ui/react';
import routes from '../../routes';

const ReportsSchool = () => {

  const title = 'Atividades dos Candidatos';

  return (  
    <ResourceScreen
      title={title}
      permissions={['']}
      resource='Candidates'
      routeBase={routes} 
      Form={Form}
      canAdd={false}
      canRemove={false}
      canEdit={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[
        { field: 'name', header: 'Nome' },
        {
          field: 'status',
          header: 'Status',
          type: 'select',
          options: [
              { value: 'approved', header: 'Aprovadas' },
          ]
        },
      ]}
      columns={[
        {
          Header: 'Nome Candidato',
          accessor: 'name'
        },
        {
          Header: 'Empresa',
          accessor: 'company'
        },
        {
          Header: 'Título da Atividade',
          accessor: 'activity'
        },
        {
          Header: 'Data da Atividade',
          accessor: 'date'
        },
        {
          Header: 'Horas',
          accessor: 'hours'
        },
        {
          Header: 'Status',
          accessor: 'status'
        },
        {
          Header: 'Atividade',
          accessor: (originalRow) => {
            const filePath = `${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${originalRow.resume}`;
            
            return (
              <Link target='_blank' href={filePath}>
                Currículo de {originalRow.name} 
              </Link>
            );
          }
        },
      ]}
    />
  );
};

export default ReportsSchool;
