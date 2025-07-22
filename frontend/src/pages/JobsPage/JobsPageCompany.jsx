import React from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip
} from '@chakra-ui/react';
import { MdCall } from 'react-icons/md';
import { useRowSelect } from 'react-table';
import _map from 'lodash/map';
import { useNavigate } from 'react-router-dom';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { JobsForm as Form } from '../../forms/JobsForm/JobsForm';
import routes from '../../routes';
import { WithModal } from '../../components/WithModal';
import { rowSelectionHook } from '../../utils/formHelpers';
import RowAction from '../../components/Filters/RowAction';
import CalledCandidates from '../../components/ViewCandidates/CalledCandidates';
import { citiesFilters } from '../../utils/filterHelpers';
import { RiDraftFill } from 'react-icons/ri';
import { FaBan, FaCheck, FaUndo } from 'react-icons/fa';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';
import { GoKebabVertical } from 'react-icons/go';
import { dateFormatter } from '../../utils/visualization';

const JobsPageCompany = () => {
  const navigate = useNavigate();
  const redirectToChooseCandidates = (jobs) => {
    navigate('choose-candidate', {
      state: {
        jobs: jobs.map((job) => ({ id: job.id, original: job.original }))
      },
      replace: true
    });
  };

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === "Escola";

  return (
    <ResourceScreen
      title='Vagas'
      permissions={['']}
      resource='Jobs'
      routeBase={routes.config.jobs}
      Form={Form}
      canEdit={!isEscola}
      canAdd={!isEscola}
      canRemove={false}
      resourceListProps={{
        downloadButtonEnabled: false,
        resourceParams: {
          withoutTrashed: true
        },
        listTableProps: {
          hooks: [
            useRowSelect,
            ...(!isEscola
              ? [rowSelectionHook((selectedFlatRows) => (
                  <Tooltip hasArrow label="Escolher candidatos para as vagas selecionadas">
                    <Button
                      size="xs"
                      colorScheme="telegram"
                      onClick={() => redirectToChooseCandidates(selectedFlatRows)}
                      disabled={selectedFlatRows.length === 0}
                    >
                      <MdCall size="12" />
                    </Button>
                  </Tooltip>
                ))]
              : [])
          ]
        }
      }}
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
        {
          Header: 'Candidaturas',
          accessor: 'id'
        },
        {
          Header: 'Nome fantasia empresa',
          accessor: 'company.fantasy_name'
        },
        {
          Header: 'Razão social empresa',
          accessor: 'company.corporate_name'
        },
        {
          Header: 'Função',
          accessor: 'role.title'
        },
        {
          Header: 'Sexo',
          accessor: 'gender_title'
        },
        {
          Header: 'Na web',
          accessor: 'show_web_title'
        },
        {
          Header: 'Endereço da empresa',
          accessor: (originalRow) => {
            const company = originalRow.company || {};
            const address = company.address || {};
            
            return address.address
              ? `${address.address}, ${address.number || 'S/N'}, ${address.city || 'Cidade não informada'} - ${address.district || 'Bairro não informado'}`
              : 'Endereço não disponível';
          }
        },
        {
          Header: 'Período',
          accessor: 'period_title'
        },
        {
          Header: 'Criado em',
          accessor: (originalData) =>
            dateFormatter(
              originalData.created_at,
              'DD/MM/YYYY HH:mm:ss',
              'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
            )
        }
      ]}
      filters={[
        /* {
          field: 'id',
          header: 'ID'
        }, */
        {
          field: 'fantasy_name',
          relation: 'company',
          header: 'Nome fantasia empresa'
        },
        {
          field: 'corporate_name',
          relation: 'company',
          header: 'Razao social empresa'
        },
        {
          field: 'gender',
          header: 'Sexo',
          type: 'select',
          options: [
            { value: 'F', header: 'Feminino' },
            { value: 'M', header: 'Masculino' },
            { value: 'AM', header: 'Ambos' },
          ],
          serverType: 'equals'
        },
        {
          field: 'type',
          header: 'Tipo',
          type: 'select',
          options: [
            { value: 'ES', header: 'Estágio' },
            { value: 'EF', header: 'FCT' }
          ],
          serverType: 'equals'
        },
        {
          field: 'show_web',
          header: 'Mostrando no site',
          type: 'select',
          options: [
            { value: '1', header: 'Sim' },
            { value: '0', header: 'Não' }
          ],
          serverType: 'equals'
        },
        {
          field: 'transport_voucher',
          header: 'Vale transporte',
          type: 'select',
          options: [
            { value: '1', header: 'Sim' },
            { value: '0', header: 'Não' }
          ],
          serverType: 'equals'
        },
        {
          field: 'available',
          header: 'Vagas disponíveis',
          serverType: 'equals'
        },
        {
          field: 'status',
          header: 'Status da Vaga',
          type: 'select',
          options: [
            { value: 1, header: 'Chamados' },
            { value: 2, header: 'Encaminhados' },
            { value: 3, header: 'Em testes' }
          ],
          relation: 'candidates'
        },
        ...citiesFilters.map((row) => {
          row.children = row.children.map((children) => {
            children.relation = children.relation.includes('company')
              ? children.relation
              : 'company.' + children.relation;
            return children;
          });

          return row;
        })
      ]}
      actions={({ activeFilters, id, rowProps, resourceProps }) => {
        const statusFilter = _map(activeFilters, 'value') || [];

        return (
          <>
          {!isEscola && (
            <WithModal
              modal={() => (
                <ModalConfirm
                  text={
                    <div>
                      Essa ação irá{' '}
                      {rowProps.deleted_at === null ? 'desativar' : 'reativar'}{' '}
                      a vaga
                    </div>
                  }
                  onConfirm={() => {
                    resourceProps.remove(id);
                  }}
                />
              )}
            >
              {({ toggleModal }) => (
                <Tooltip
                  hasArrow
                  label={`${
                    rowProps.deleted_at === null ? 'Desativar' : 'Reativar'
                  } vaga`}
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
            {!isEscola && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label='Opções'
                  icon={<GoKebabVertical />}
                  variant='outline'
                  size='xs'
                />
                <MenuList>
                  {[
                    {
                      title: 'Chamados',
                      status: 1,
                      component: <CalledCandidates job={id} status={1} />
                    },
                    {
                      title: 'Encaminhados',
                      status: 2,
                      component: <CalledCandidates job={id} status={2} />
                    },
                    {
                      title: 'Em testes',
                      status: 3,
                      component: <CalledCandidates job={id} status={3} />
                    }
                  ]
                    /* .filter(
                      (action) =>
                        statusFilter.length === 0 ||
                        (statusFilter && statusFilter.includes(action.status))
                    ) */
                    .map((action) => (
                      <WithModal
                        key={action.status}
                        size='full'
                        modal={action.component}
                      >
                        {({ toggleModal }) => (
                          <RowAction
                            onClick={toggleModal}
                            key={id}
                            title={action.title}
                            {...rowProps}
                          />
                        )}
                      </WithModal>
                    ))}
                </MenuList>
              </Menu>
            )}
          </>
        );
      }}
    />
  );
};

export default JobsPageCompany;
