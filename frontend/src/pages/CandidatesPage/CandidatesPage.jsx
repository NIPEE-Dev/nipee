import React from 'react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { CandidatesForm as Form } from '../../forms/CandidatesForm/CandidatesForm';
import { Link } from '@chakra-ui/react';
import routes from '../../routes';
import { citiesFilters } from '../../utils/filterHelpers';

const CandidatesPage = () => {

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEmpresa = userRole === "Empresa";
  const isCandidato = userRole === "Candidato";
  const isEscola = userRole === "Escola";
  const isAdm = userRole === "Administrador Geral";

  const title = isAdm || isEscola || isEmpresa ? 'Candidatos' : 'Meu Perfil';

  return (  
    <ResourceScreen
      title={title}
      permissions={['']}
      resource='Candidates'
      routeBase={routes.config.candidates}
      Form={Form}
      canAdd={!(isEmpresa || isCandidato)}
      canRemove={!(isEmpresa || isCandidato || isEscola)}
      canEdit={!(isEmpresa || isEscola)}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[
        { field: 'name', header: 'Nome' },
        {
          field: 'gender',
          header: 'Género',
          type: 'select',
          options: [
            { value: 'F', header: 'Feminino' },
            { value: 'M', header: 'Masculino' }
          ]
        },
        { field: 'course', 
          header: 'Curso',
        type: 'text' // como posso fazer com o select ???
      },
        
        ...citiesFilters
      ]}
      columns={[
       
        {
          Header: 'Nome',
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
          Header: 'Escola',
          accessor: 'school.corporate_name'
        },
      ]}
    />
  );
};

export default CandidatesPage;
