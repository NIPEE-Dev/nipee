import React from 'react';
import {
  FaBan,
  FaCheck,
  FaRegCalendarTimes,
  FaTrashAlt,
  FaUndo
} from 'react-icons/fa';
import {
  MdEdit 
} from 'react-icons/md';
import { Button, Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import ContractsForm from '../../forms/ContractsForm/ContractsForm';
import routes from '../../routes';
import { WithModal } from '../../components/WithModal';
import { dateFormatter } from '../../utils/visualization';
import { TerminateContractModal } from './TerminateContractModal';
import PermissionAction from '../../components/Permission/PermissionAction';
import { PinConfirmationModal } from './PinConfirmationModal';
import SignaturePad from '../../components/SignaturePad/SignaturePad';

const ContractsPage = () => {

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEmpresa = userRole === "Empresa";
  const isCandidato = userRole === "Candidato";
  const isAdm = userRole === "Administrador Geral";

  return (
    <ResourceScreen
      title='Protocolos'
      permissions={['']}
      resource='Contracts'
      routeBase={routes.contracts}
      Form={ContractsForm}
      canAdd={isEmpresa || isAdm}
      canEdit={isEmpresa || isAdm}
      canRemove={false}
      resourceUpdateProps={{
        onlyDiff: false
      }}
      resourceListProps={{
        downloadButtonEnabled: false
      }}
      actions={({ id, rowProps, resourceProps }) => (
        <>
          <PermissionAction permission='contracts.end'>
            <WithModal
              modal={() => (
                <TerminateContractModal
                  onConfirm={(motive, payCurrentMonth, terminatedAt) => {
                    resourceProps.remove(id, {
                      motive,
                      payCurrentMonth,
                      terminatedAt,
                      preserveRow: true
                    });
                  }}
                />
              )}
            >
              {({ toggleModal }) =>
                [1, 2].includes(rowProps.status) && (
                  <Tooltip hasArrow label='Rescindir protocolo'>
                    <Button
                      disabled={resourceProps.removingRecords.includes(id)}
                      isLoading={resourceProps.removingRecords.includes(id)}
                      onClick={toggleModal}
                      size='xs'
                      colorScheme='orange'
                    >
                      <FaBan />
                    </Button>
                  </Tooltip>
                )
              }
            </WithModal>
          </PermissionAction>
          <PermissionAction permission='contracts.reactive'>
            <WithModal
              modal={() => (
                <PinConfirmationModal
                  text={<div>Essa ação irá reativar o protocolo atual.</div>}
                  onConfirm={(terminationPin) => {
                    resourceProps.remove(id, {
                      reactive: true,
                      preserveRow: true,
                      terminationPin
                    });
                  }}
                />
              )}
            >
              {({ toggleModal }) =>
                [0].includes(rowProps.status) && (
                  <Tooltip hasArrow label='Reativar protocolo'>
                    <Button
                      disabled={resourceProps.removingRecords.includes(id)}
                      isLoading={resourceProps.removingRecords.includes(id)}
                      onClick={toggleModal}
                      size='xs'
                      colorScheme='green'
                    >
                      <FaUndo />
                    </Button>
                  </Tooltip>
                )
              }
            </WithModal>
          </PermissionAction>
          <PermissionAction permission='contracts.reactive'>
            <WithModal
              modal={({ closeModal }) => (
                <PinConfirmationModal
                  text={
                    <div>
                      Essa ação irá excluir em definitivo o protocolo. Essa ação
                      não pode ser desfeita
                    </div>
                  }
                  onConfirm={(terminationPin) => {
                    closeModal();
                    resourceProps.remove(id, {
                      delete_full: true,
                      terminationPin
                    });
                  }}
                />
              )}
            >
              {({ toggleModal }) => (
                <Tooltip hasArrow label='Excluir protocolo'>
                  <Button
                    disabled={resourceProps.removingRecords.includes(id)}
                    isLoading={resourceProps.removingRecords.includes(id)}
                    onClick={toggleModal}
                    size='xs'
                    colorScheme='red'
                  >
                    <FaTrashAlt />
                  </Button>
                </Tooltip>
              )}
            </WithModal>
          </PermissionAction>
        </>
      )}
      columns={[
        {
          id: 'status',
          Header: 'Status',
          accessor: (originalRow) => {
            const types = [
              <Tooltip
                label={
                  <div>
                    Motivo: {originalRow.end_contract_reason}
                    <br /> Data: {originalRow.terminated_at}
                  </div>
                }
              >
                <Tag variant='subtle' colorScheme='red'>
                  <TagLeftIcon boxSize='12px' as={FaTrashAlt} />
                  <TagLabel>Rescindido</TagLabel>
                </Tag>
              </Tooltip>,
              <Tag variant='subtle' colorScheme='green'>
                <TagLeftIcon boxSize='12px' as={FaCheck} />
                <TagLabel>Ativo</TagLabel>
              </Tag>,
              <Tag variant='subtle' colorScheme='gray'>
                <TagLeftIcon boxSize='12px' as={FaRegCalendarTimes} />
                <TagLabel>Vencido</TagLabel>
              </Tag>
            ];

            return types[originalRow.status];
          }
        },
       
        {
          Header: 'Nome fantasia Empresa',
          accessor: 'company.fantasy_name'
        },
        {
          Header: 'Razão Social Empresa',
          accessor: 'company.corporate_name'
        },
        {
          Header: 'Nome do candidato',
          accessor: 'candidate.name'
        },
        {
          Header: 'Escola',
          accessor: 'school.corporate_name'
        },
       /*  {
          Header: 'Inicio do protocolo',
          accessor: (originalData) =>
            dateFormatter(originalData.start_contract_vigence)
        }, */
        {
          Header: 'Fim do protocolo',
          accessor: (originalData) =>
            dateFormatter(originalData.end_contract_vigence)
        }
      ]}
      filters={[
       
    
   
        {
          field: 'fantasy_name',
          relation: 'school',
          header: 'Nome da escola'
        },
       
        {
          field: 'name',
          relation: 'candidate',
          header: 'Nome do candidato'
        },
        {
          field: 'status',
          header: 'Status do protocolo',
          type: 'select',
          options: [
            { value: 0, header: 'Rescindido' },
            { value: 1, header: 'Ativo' },
            { value: 2, header: 'À vencer' },
            { value: 3, header: 'Vencido' }
          ]
        },
       
      ]}
    />
  );
  
};

export default ContractsPage;
