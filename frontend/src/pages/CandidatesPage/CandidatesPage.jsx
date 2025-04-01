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

  const title = isAdm || isEscola || isEmpresa ? 'Listagem de Candidatos' : 'Meu Cadastro';

  return (
    <ResourceScreen
      title={title}
      permissions={['']}
      resource='Candidates'
      routeBase={routes.config.candidates}
      Form={Form}
      canAdd={!(isEmpresa || isCandidato)}
      canRemove={!(isEmpresa || isCandidato)}
      canEdit={!isEmpresa}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Nome' },
        { field: 'tags', header: 'Palavras Chaves', serverType: 'like' },
        {
          field: 'gender',
          header: 'Género',
          type: 'select',
          options: [
            { value: 'F', header: 'Feminino' },
            { value: 'M', header: 'Masculino' }
          ]
        },
        {
          field: 'birth_day',
          header: 'Aniversariantes',
          type: 'select',
          options: [
            { value: 0, header: 'Deste mês' },
            { value: 1, header: 'Próximo mês' }
          ]
        },
        {
          field: 'period',
          header: 'Período',
          type: 'select',
          options: [
            { value: 'M', header: 'Manhã' },
            { value: 'T', header: 'Tarde' },
            { value: 'N', header: 'Noite' },
            { value: 'I', header: 'Integral' }
          ]
        },
        {
          field: 'serie',
          header: 'Série',
          type: 'select',
          options: [
            ...[...Array(9).keys()].map((v) => ({
              value: v + 1,
              header: `${v + 1}° Série`
            })),
            ...[11, 12, 13].map((v) => ({
              value: v,
              header: `${`${v}}`.charAt(1)}° Série (Ensino Secundário)`
            }))
          ]
        },
        {
          field: 'semester',
          header: 'Ano',
          type: 'select',
          options: [...Array(6).keys()].map((v) => ({
            value: v + 1,
            header: `${v + 1}° Semestre`
          }))
        },
        {
          field: 'status',
          header: 'Status',
          type: 'select',
          options: [
            { value: 1, header: 'Chamados' },
            { value: 2, header: 'Encaminhados' },
            { value: 3, header: 'Em testes' },
            { value: 4, header: 'Estagiários' },
            { value: 5, header: 'FCT' },
            { value: 6, header: 'Protocolo' }
          ],
          relation: 'jobs'
        },
        ...citiesFilters
      ]}
      columns={[
        {
          Header: 'ID',
          accessor: 'id',
          sortable: false
        },
        {
          Header: 'Nome',
          accessor: 'name'
        },
        {
          Header: 'Curriculum Vitae',
          accessor: (originalRow) => {
            const filePath = `${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${originalRow.resume}`;
            
            return (
              <Link target='_blank' href={filePath}>
                Curriculum Vitae de {originalRow.name} 
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
        {
          Header: 'Período',
          accessor: 'period'
        },
        {
          Header: 'Semestre',
          accessor: 'semester'
        }
      ]}
    />
  );
};

export default CandidatesPage;
