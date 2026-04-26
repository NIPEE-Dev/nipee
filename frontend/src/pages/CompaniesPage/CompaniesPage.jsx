import React from 'react';
import { Button, Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import { RiDraftFill } from 'react-icons/ri';
import { FaBan, FaCheck, FaUndo } from 'react-icons/fa';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { CompaniesForm as Form } from '../../forms/CompaniesForm/CompaniesForm';
import routes from '../../routes';
import {
  citiesFilters,
  contactFilters,
  responsiblesFilters
} from '../../utils/filterHelpers';
import { WithModal } from '../../components/WithModal';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';

const CompaniesPage = () => {

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEmpresa = userRole === "Empresa";
  const isAdm = userRole === "Administrador Geral";
  const isUnidade = userRole === "Unidade";
  const isSetor = userRole === "Setor";

  const title = isAdm ? 'Empresas' : 'Meu Registo';

  return (
    <ResourceScreen
      title={title}
      permissions={['']}
      resource='Companies'
      routeBase={routes.config.companies}
      Form={Form}
      canAdd={!(isEmpresa || isUnidade || isSetor)}
      canRemove={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      actions={({ id, rowProps, resourceProps }) => (
        <WithModal
          modal={() => (
            <ModalConfirm
              text={
                <div>
                  Essa ação irá{' '}
                  {rowProps.deleted_at === null ? 'desativar' : 'reativar'}{' '}
                  a empresa
                </div>
              }
              onConfirm={(motive) => {
                resourceProps.remove(id, { preserveRow: true });
              }}
            />
          )}
        >
          {({ toggleModal }) => (
            <Tooltip
              hasArrow
              label={`${
                rowProps.deleted_at === null ? 'Desativar' : 'Reativar'
              } empresa`}
            >
              <Button
                disabled={resourceProps.removingRecords.includes(id)}
                isLoading={resourceProps.removingRecords.includes(id)}
                onClick={toggleModal}
                size='xs'
                colorScheme={rowProps.deleted_at === null ? 'red' : 'green'}
              >
                {rowProps.deleted_at === null ? <FaBan /> : <FaUndo />}
              </Button>
            </Tooltip>
          )}
        </WithModal>
      )}
      columns={[
        {
          id: 'deleted_at',
          Header: 'Status',
          accessor: (originalRow) => {
            const types = [
              <Tag variant='subtle' colorScheme='orange'>
                <TagLeftIcon boxSize='12px' as={RiDraftFill} />
                <TagLabel>Desativada</TagLabel>
              </Tag>,
              <Tag variant='subtle' colorScheme='green'>
                <TagLeftIcon boxSize='12px' as={FaCheck} />
                <TagLabel>Ativa</TagLabel>
              </Tag>
            ];

            return types[originalRow.deleted_at === null ? 1 : 0];
          }
        },
       /*  {
          Header: 'ID',
          accessor: 'id'
        }, */
        {
          Header: 'Nome da Entidade',
          accessor: 'fantasy_name'
        },
        {
          Header: 'Registo Comercial',
          accessor: 'corporate_name'
        },
        {
          Header: 'Responsável',
          accessor: 'responsible.name'
        },
        {
          Header: 'Email',
          accessor: 'responsible.email'
        },
        {
          Header: 'Telemóvel',
          accessor: 'responsible.phone'
        },
    /*    {
          Header: 'Documento',
          accessor: 'document_status'
        } */
      ]}
      filters={[
        /* {
          field: 'id',
          header: 'ID'
        }, */
        {
          field: 'fantasy_name',
          header: 'Nome da Entidade'
        },
        {
          field: 'corporate_name',
          header: 'Registo Comercial'
        },
        {
          field: 'cnpj',
          header: 'NIF'
        },
        {
          field: 'status',
          header: 'Status',
          type: 'select',
          options: [
            { value: 0, header: 'Desativada' },
            { value: 1, header: 'Ativa' }
          ],
          serverType: 'equals'
        },
  /*       {
          field: 'municipal_registration',
          header: 'Inscrição estadual'
        }, */
        {
          field: 'branch_of_activity',
          header: 'Ramo de atividade'
        },
        {
          field: 'supervisor',
          header: 'Supervisor'
        },
        {
          field: 'birth_day',
          header: 'Aniversariantes (Responsáveis)',
          type: 'select',
          options: [
            { value: 0, header: 'Deste mês' },
            { value: 1, header: 'Próximo mês' }
          ]
        },
        {
          field: 'observations',
          header: 'Ramo de atividade da empresa'
        },
        ...citiesFilters,
        ...responsiblesFilters,
        ...contactFilters
      ]}
    />
  );

};

export default CompaniesPage;
