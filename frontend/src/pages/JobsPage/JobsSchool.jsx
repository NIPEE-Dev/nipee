import React from 'react';
import _map from 'lodash/map';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { JobsForm as Form } from '../../forms/JobsForm/JobsForm';
import routes from '../../routes';
import { Link } from 'react-router-dom';
import { Badge } from '@chakra-ui/react';

const JobsSchool = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";

  const statusColorMap = {
    1: 'yellow',
    4: 'purple',
    5: 'blue',
    7: 'orange',
    2: 'green',
    3: 'red',
    6: 'red',
  };

  const getStatusLabel = (status) => {
    const labels = {
      '1': 'Pendente',
      '2': 'Aprovado',
      '3': 'Reprovado',
      '4': 'Esperando resposta',
      '5': 'Em entrevista',
      '6': 'Entrevista rejeitada',
      '7': 'Em teste',
    };
    return labels[status] || 'Desconhecido';
  };

  return (
    <ResourceScreen
      title='Processos dos alunos'
      permissions={['']}
      resource='Interviewing'
      routeBase={routes.interviewing}
      Form={Form}
      canEdit={!isEscola}
      canAdd={!isEscola}
      canRemove={false}
      canView={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      columns={[
        {
          Header: 'Aluno',
          accessor: 'name'
        },
        {
          Header: 'Currículo',
          accessor: (originalRow) => {
            const filePath = `${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${originalRow.resume}`;
            
            return (
              <Link target='_blank' href={filePath}>
                Currículo de {originalRow.name} 
              </Link>
            );
          }
        },
        {
          Header: 'Género',
          accessor: 'gender_title'
        },
        {
          Header: 'Data de nascimento',
          accessor: 'birth_day'
        },
        {
          Header: 'Curso',
         accessor: 'course_title'
        },
        {
          Header: 'Localidade',
          accessor: 'address.city'
        },
        {
          Header: 'Conselho',
          accessor: 'address.district'
        },
        {
          Header: 'Telemóvel',
          accessor: 'contact.phone'
        },
        {
          Header: 'Status',
          accessor: 'interviews',
          Cell: ({ row }) => {
            const interviews = row.original.interviews || [];
            
            return (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {interviews.map((c, index) => (
                  <Badge 
                    key={index}
                    colorScheme={statusColorMap[c.status] || 'gray'} 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                  >
                    {getStatusLabel(c.status) || 'Desconhecido'}
                  </Badge>
                ))}
              </div>
            );
          }
        },
      ]}
    />
  );
};

export default JobsSchool;
