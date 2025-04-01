import React, { useCallback, useEffect, useState } from 'react';
import updateImmutability from 'immutability-helper';
import { diff } from 'deep-object-diff';
import {
  chakra,
  AccordionIcon,
  AccordionItem,
  ButtonGroup,
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  IconButton,
  Link,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useEditableControls,
  useStyles,
  Box,
  Spinner,
  Button,
  Tfoot,
  Th,
  Tr,
  useToast
} from '@chakra-ui/react';
import _sortBy from 'lodash/sortBy';
import _countBy from 'lodash/countBy';
import moment from 'moment/min/moment-with-locales';
import {
  MdDownload,
  MdOutlineNavigateNext,
  MdOutlineRestoreFromTrash
} from 'react-icons/md';
import { FaCheck, FaEdit, FaWindowClose } from 'react-icons/fa';
import getRoute from '../../utils/getRoute';
import routes from '../../routes';
import { moneyFormatter } from '../../utils/visualization';
import { Table } from '../../components/Table/Table';
import Resource from '../../components/Resource/Resource';
import MoneyInput from '../../components/FormField/MoneyInput';
import PermissionAction from '../../components/Permission/PermissionAction';
import withAuth from '../../store/utils/withAuth';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';
import { WithModal } from '../../components/WithModal';

const EditableControls = ({ isSaving }) => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent='center' size='sm'>
      <IconButton icon={<FaCheck />} {...getSubmitButtonProps()} />
      <IconButton icon={<FaWindowClose />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent='center'>
      <IconButton
        size='sm'
        icon={isSaving ? <Spinner size='xs' /> : <FaEdit />}
        disabled={isSaving}
        {...getEditButtonProps()}
      />
    </Flex>
  );
};

const EditableContent = ({ isSaving }) => {
  const { isEditing } = useEditableControls();
  return (
    <HStack>
      <Tooltip label='Clique no icone ao lado para editar este valor'>
        <EditablePreview
          py={2}
          px={4}
          bg={useColorModeValue('gray.200', 'gray.600')}
          fontSize='1rem'
          _hover={{
            background: useColorModeValue('gray.300', 'gray.500')
          }}
        />
      </Tooltip>
      {isEditing && (
        <MoneyInput
          style={{ maxWidth: '96px', padding: '0', fontSize: '17px' }}
          customInput={EditableInput}
        />
      )}
      <EditableControls isSaving={isSaving} />
    </HStack>
  );
};

const FinancialDetailsForm = ({
  company,
  canEditRowValue,
  setTotalValue,
  readOnly,
  updateDetails,
  id,
  commissions,
  auth: { profile, permissions }
}) => {
  const [totalValue, setTotalGroupValue] = useState(0);
  const { isOpen, getButtonProps } = useDisclosure();
  const toast = useToast();

  const buttonProps = getButtonProps();
  const { button } = useStyles();
  button.cursor = 'pointer';

  useEffect(() => {
    setTotalGroupValue(company.total_value);
  }, [company.total_value]);

  const commission = commissions.find(
    (commission) =>
      commission.company_id === company.id &&
      (permissions.includes('financial-close.commission-all') ||
        (permissions.includes('financial-close.commission-me') &&
          commission.seller_id === profile.user_id))
  );

  const getValue = (originalValue) => {
    let value;
    if (+originalValue >= 0) {
      value = moneyFormatter(originalValue);
    } else {
      value = <Text color='red'>{moneyFormatter(+originalValue)}</Text>;
    }

    return value;
  };

  const updateCommissionAndGroupValue = useCallback(
    (response, shouldDelete = false) => {
      const companyId = response.value.data.data.financial_close_company_id;
      setTotalGroupValue(response.value.data.group_total);
      setTotalValue(response.value.data.total);

      updateDetails(id, (records) =>
        updateImmutability(records, {
          commissions: {
            $set: response.value.data.commission
          },
          ...(shouldDelete &&
            response.value.data.companyDelete && {
              companies: {
                $apply: (companies) =>
                  companies.filter((company) => company.id !== companyId)
              }
            }),
          ...(shouldDelete &&
            !response.value.data.companyDelete && {
              companies: {
                $apply: (companies) =>
                  companies.map((company) => {
                    if (company.id === companyId) {
                      company.items = company.items.filter(
                        (item) => item.id !== response.value.data.data.id
                      );
                    }
                    return company;
                  })
              }
            })
        })
      );
    },
    [updateDetails]
  );

  return (
    <>
      <Resource resource='FinancialCompany' id={company.id} idFetch={false}>
        {({ savingRecords, update }) => (
          <AccordionItem>
            <chakra.table
              width='100%'
              className='chakra-accordion__button'
              __css={{ ...button }}
            >
              <tbody>
                <tr>
                  <td {...buttonProps} width='40%'>
                    <Link
                      href={`/${getRoute(routes.companies.view, {
                        id: company.company.id
                      })}`}
                      isExternal
                    >
                      {company.company.corporate_name}
                    </Link>
                  </td>
                  <td {...buttonProps} width='27%'>
                    {Object.keys(_countBy(company.items, 'contract_id')).length}{' '}
                    Candidato(s)
                  </td>
                  <td width='30%'>
                    <Text py={2}>{moneyFormatter(totalValue)}</Text>
                  </td>
                  <td {...buttonProps}>
                    <HStack spacing='24px'>
                      <Button
                        as='a'
                        href={`${
                          import.meta.env.VITE_BACKEND_BASE_URL
                        }/financial-company/${
                          company.id
                        }/discriminating/download`}
                        target='_blank'
                        leftIcon={<MdDownload />}
                        colorScheme='cyan'
                        variant='outline'
                        size='sm'
                      >
                        Descritivo
                      </Button>

                      <AccordionIcon />
                    </HStack>
                  </td>
                </tr>
              </tbody>
            </chakra.table>
            <Collapse in={isOpen} animateOpacity>
              <Box py={2}>
                <Table
                  tfoot={
                    commission && (
                      <Tfoot bg='teal'>
                        <Tr>
                          <Th color='white'>Comissão</Th>
                          <Th color='white'>
                            {commission.seller}:{' '}
                            {moneyFormatter(commission.commission)} (
                            {commission.percentCommission.toFixed(2)}%)
                          </Th>
                        </Tr>
                      </Tfoot>
                    )
                  }
                  tableContainerProps={{
                    variant: 'striped',
                    size: 'sm'
                  }}
                  columns={[
                    {
                      Header: 'Protocolo',
                      accessor: (originalRow) => (
                        <Link
                          href={`/${getRoute(routes.contracts.view, {
                            id: originalRow.contract?.id
                          })}`}
                          isExternal
                        >
                          {originalRow.contract?.id}
                        </Link>
                      )
                    },
                    {
                      Header: 'Vaga',
                      accessor: (originalRow) => (
                        <Link
                          href={`/${getRoute(routes.jobs.view, {
                            id: originalRow.contract?.original_job?.id
                          })}`}
                          isExternal
                        >
                          {originalRow.contract.job.role}
                        </Link>
                      )
                    },
                    {
                      Header: 'Estagiário',
                      accessor: (originalRow) => (
                        <Link
                          href={`/${getRoute(routes.candidates.view, {
                            id: originalRow.contract.candidate_id
                          })}`}
                          isExternal
                        >
                          {originalRow.contract.candidate.name}
                        </Link>
                      )
                    },
                    {
                      Header: 'Inicio',
                      accessor: 'contract.start_contract_vigence'
                    },
                    {
                      Header: 'Término',
                      accessor: (originalRow) =>
                        originalRow.contract.terminated_at ||
                        originalRow.contract.end_contract_vigence
                    },
                    {
                      Header: 'Valor',
                      accessor: (originalRow) => (
                        <>
                          {canEditRowValue && !readOnly && (
                            <Editable
                              textAlign='center'
                              defaultValue={getValue(originalRow.value)}
                              fontSize='2xl'
                              isPreviewFocusable={false}
                              submitOnBlur={false}
                              onSubmit={(value) => {
                                update(originalRow.id, { value }).then(
                                  (response) => {
                                    updateCommissionAndGroupValue(response);
                                  }
                                );
                              }}
                            >
                              <EditableContent
                                defaultValue={originalRow.value}
                                isSaving={savingRecords.includes(
                                  originalRow.id
                                )}
                              />
                            </Editable>
                          )}
                          {(readOnly || !canEditRowValue) &&
                            getValue(originalRow.value)}
                        </>
                      )
                    },
                    {
                      Header: 'Tipo',
                      accessor: (originalRow) => {
                        const types = [
                          <Tag variant='subtle' colorScheme='green'>
                            <TagLabel>Adesão</TagLabel>
                          </Tag>,
                          <Tag variant='subtle' colorScheme='green'>
                            <TagLabel>Mensalidade</TagLabel>
                          </Tag>,
                          <>
                            <Tag variant='subtle' colorScheme='green'>
                              <TagLabel>Adesão</TagLabel>
                            </Tag>
                            <Tag ml={2} variant='subtle' colorScheme='orange'>
                              <TagLabel>Recolocação</TagLabel>
                            </Tag>
                          </>,
                          <Tag variant='subtle' colorScheme='teal'>
                            <TagLabel>Mensalidade Retroativa</TagLabel>
                          </Tag>
                        ];

                        return types[originalRow.type];
                      }
                    },
                    {
                      Header: 'Referência',
                      accessor: (originalRow) => {
                        if (originalRow.start_date && originalRow.end_date) {
                          return originalRow.type == 3 ? (
                            <>
                              <chakra.span textTransform='capitalize'>
                                {moment(originalRow.start_date).format(
                                  'MMMM/YYYY'
                                )}
                              </chakra.span>{' '}
                              à{' '}
                              <chakra.span textTransform='capitalize'>
                                {moment(originalRow.end_date).format(
                                  'MMMM/YYYY'
                                )}
                              </chakra.span>
                            </>
                          ) : (
                            <chakra.span textTransform='capitalize'>
                              {moment(originalRow.end_date).format('MMMM/YYYY')}
                            </chakra.span>
                          );
                        } else if (
                          originalRow.start_date &&
                          !originalRow.end_date
                        ) {
                          return (
                            <chakra.span textTransform='capitalize'>
                              {moment(originalRow.start_date).format(
                                'MMMM/YYYY'
                              )}
                            </chakra.span>
                          );
                        } else if (
                          !originalRow.start_date &&
                          originalRow.end_date
                        ) {
                          return (
                            <chakra.span textTransform='capitalize'>
                              {moment(originalRow.end_date).format('MMMM/YYYY')}
                            </chakra.span>
                          );
                        }

                        return <></>;
                      }
                    },
                    {
                      Header: 'Ação',
                      accessor: (originalRow) => (
                        <Resource
                          resource='FinancialCompanyItem'
                          autoFetch={false}
                        >
                          {({ remove, removingRecords }) => (
                            <WithModal
                              modal={({ closeModal }) => (
                                <ModalConfirm
                                  text={
                                    <div>
                                      Deseja remover a cobrança de{' '}
                                      <b>
                                        {originalRow.contract.candidate.name}
                                      </b>{' '}
                                      no valor de{' '}
                                      <b>{getValue(originalRow.value)}</b> do
                                      cliente{' '}
                                      <b>{company.company.corporate_name}</b>?
                                    </div>
                                  }
                                  onConfirm={() => {
                                    closeModal();
                                    setTimeout(() => {
                                      remove(originalRow.id).then(
                                        (response) => {
                                          updateCommissionAndGroupValue(
                                            response,
                                            true
                                          );
                                          toast({
                                            title: 'Sucesso!',
                                            description: `Cobrança apagada com sucesso!`,
                                            variant: 'left-accent',
                                            duration: 9000,
                                            isClosable: true,
                                            status: 'success',
                                            position: 'top-right'
                                          });
                                        }
                                      );
                                    }, 500);
                                  }}
                                  onCancel={closeModal}
                                />
                              )}
                            >
                              {({ toggleModal }) => (
                                <Button
                                  onClick={toggleModal}
                                  colorScheme='red'
                                  size='sm'
                                  isLoading={removingRecords.includes(
                                    originalRow.id
                                  )}
                                >
                                  <MdOutlineRestoreFromTrash />
                                </Button>
                              )}
                            </WithModal>
                          )}
                        </Resource>
                      )
                    }
                  ]}
                  isLoading={false}
                  records={_sortBy(
                    company.items,
                    (i) => i.contract.candidate.name
                  )}
                />
              </Box>
            </Collapse>
          </AccordionItem>
        )}
      </Resource>
    </>
  );
};

export default withAuth(FinancialDetailsForm);
