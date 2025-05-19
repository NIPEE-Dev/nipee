import React, { useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { IoAddSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import withResource from '../../utils/withResource';
import Card from '../Card/Card';
import getRoute from '../../utils/getRoute';
import { WithModal } from '../WithModal';
import { ModalConfirm } from '../WithModal/ModalConfirm';
import Filters from '../Filters/Filters';
import { Table } from '../Table/Table';
import { TableDownloadButton } from '../TableDownloadButton';

const ResourceList = ({
  title,
  canAdd,
  routeBase,
  resourceProps,
  filters,
  actions,
  downloadButtonEnabled,
  ...props
}) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const toast = useToast();

  const { isLoading, pagination } = resourceProps;
  const records = useMemo(() => resourceProps.records, [resourceProps.records]);

  const columns = useMemo(() => {
    let curColumns = [...props.columns];
    const actionColumns =
      props.canRemove || props.canEdit || props.canView
        ? [
            {
              Header: 'Ações',
              filterable: false,
              Cell: ({
                row: {
                  original: { id, ...rowProps }
                }
              }) => {
                const isRemoving = resourceProps.removingRecords.includes(id);
                const rowActions = actions({
                  activeFilters,
                  id,
                  rowProps,
                  resourceProps
                });

                return (
                  <HStack spacing={1} style={{ width: '116px' }}>
                    {props.canView && (
                      <Tooltip hasArrow label='Visualizar'>
                        <Button
                          size='xs'
                          as={isRemoving ? null : Link}
                          to={`./${getRoute('view/:id', { id })}`}
                          disabled={isRemoving}
                          colorScheme='blue'
                        >
                          <FaEye />
                        </Button>
                      </Tooltip>
                    )}
                    {props.canRemove && (
                      <WithModal
                        modal={({ closeModal }) => (
                          <ModalConfirm
                            onConfirm={() => {
                              resourceProps.remove(id).then(() => {
                                toast({
                                  title: 'Sucesso!',
                                  description: `Registo apagado com sucesso!`,
                                  variant: 'left-accent',
                                  duration: 9000,
                                  isClosable: true,
                                  position: 'top-right'
                                });
                              });
                              closeModal();
                            }}
                            onCancel={closeModal}
                          />
                        )}
                      >
                        {({ toggleModal }) => (
                          <Tooltip hasArrow label='Excluir'>
                            <Button
                              onClick={toggleModal}
                              size='xs'
                              to={`../${getRoute('edit/:id', { id })}`}
                              isLoading={isRemoving}
                              colorScheme='red'
                            >
                              <FaTrashAlt />
                            </Button>
                          </Tooltip>
                        )}
                      </WithModal>
                    )}

                    {rowActions}
                  </HStack>
                );
              }
            }
          ]
        : [];

    return actionColumns.concat(curColumns);
  }, [props.columns, resourceProps.removingRecords, activeFilters]);

  return (
    <Card>
      <Flex justifyContent='space-between' alignItems='center'>
        <HStack mb={3} alignItems='center'>
          <Text align='left' fontSize='3xl'>
            <span>{title}</span>
          </Text>
          {isLoading && (
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='md'
              ml={2}
            />
          )}
        </HStack>

        <div>
          {downloadButtonEnabled && (
            <TableDownloadButton resource={resourceProps.resource} />
          )}

          {canAdd && (
            <Link to='add'>
              <Button
                colorScheme='teal'
                variant='solid'
                leftIcon={<IoAddSharp />}
              >
                Criar
              </Button>
            </Link>
          )}
        </div>
      </Flex>

      {filters && (
        <Filters
          filters={filters}
          onActiveFilterChange={(changedFilters) =>
            setActiveFilters(changedFilters)
          }
        />
      )}

      <Divider my={4} />
      <Table
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        records={records}
        {...props.listTableProps}
      />
    </Card>
  );
};

export default withResource(ResourceList, (componentProps) => ({
  isLoading: componentProps.isLoading,
  autoFetch: componentProps.autoFetch,
  removingRecords: componentProps.removingRecords,
  resource: componentProps.resource,
  records: componentProps.records,
  resourceParams: componentProps.resourceParams
}));
