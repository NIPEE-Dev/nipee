import React from 'react';
import { Button, Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import { RiDraftFill } from 'react-icons/ri';
import { FaBan, FaCheck, FaUndo } from 'react-icons/fa';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { SchoolsForm as Form } from '../../forms/SchoolsForm/SchoolsForm';
import routes from '../../routes';
import {
  citiesFilters,
  contactFilters,
  responsiblesFilters
} from '../../utils/filterHelpers';
import { WithModal } from '../../components/WithModal';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';

const SchoolsPage = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";
  const isAdm = userRole === "Administrador Geral";

  const title = isAdm ? 'Escolas' : 'Meu Perfil';

 return (
  <ResourceScreen
  title={title}
  permissions={['']}
  resource='Schools'
  routeBase={routes.schools}
  Form={Form}
  canRemove={false}
  canAdd={!isEscola}
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
              {rowProps.deleted_at === null ? 'desativar' : 'reativar'} a
              escola
            </div>
          }
          onConfirm={(motive) => {
            resourceProps.remove(id, { motive, preserveRow: true });
          }}
        />
      )}
    >
      {({ toggleModal }) => (
        <Tooltip
          hasArrow
          label={`${
            rowProps.deleted_at === null ? 'Desativar' : 'Reativar'
          } escola`}
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
  filters={[
    {
      field: 'id',
      header: 'ID'
    },
    {
      field: 'fantasy_name',
      header: 'Nome da Instituição'
    },
    {
      field: 'corporate_name',
      header: 'Nome do Agrupamento'
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
    ...citiesFilters,
    ...responsiblesFilters,
    ...contactFilters
  ]}
  columns={[
    {
      Header: 'ID',
      accessor: 'id'
    },
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
    {
      Header: 'Nome da Instituição',
      accessor: 'fantasy_name'
    },
    {
      Header: 'Nome do Agrupamento',
      accessor: 'corporate_name'
    },
    {
      Header: 'Conselho',
      accessor: 'address.district'
    },
    {
      Header: 'Estado',
      accessor: 'address.uf'
    }
  ]}
/>
 );
};

export default SchoolsPage;
