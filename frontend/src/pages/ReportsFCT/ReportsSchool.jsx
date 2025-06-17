import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { CandidatesForm as Form } from '../../forms/CandidatesForm/CandidatesForm';
import { Link } from '@chakra-ui/react';
import routes from '../../routes';

const ReportsSchool = () => {

  const title = 'Relatórios dos Alunos';

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
      ]}
      columns={[
        {
          Header: 'Nome Aluno',
          accessor: 'name'
        },
        {
          Header: 'Empresa',
          accessor: 'company'
        },
        {
          Header: 'Total de horas',
          accessor: 'hours_fct'
        },
        {
          Header: 'Data de Envio',
          accessor: 'date'
        },
        {
          Header: 'Relatório',
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
