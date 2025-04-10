import React, { useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  Table as TableChakra,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  HStack,
  Center,
  Flex
} from '@chakra-ui/react';
import { BsArrowDown, BsArrowDownUp, BsArrowUp } from 'react-icons/bs';
import Pagination from '@choc-ui/paginator';
import { useSearchParams } from 'react-router-dom';

export const Table = ({
  isLoading = false,
  pagination = false,
  disablePagination = false,
  columns,
  records,
  hooks,
  tfoot = null,
  ...props
}) => {
  let [searchParams, setSearchParams] = useSearchParams();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows
  } = useTable({ columns, data: records }, useSortBy, ...hooks);

  useEffect(() => {
    if (props.onSelectRowsChange) {
      props.onSelectRowsChange(selectedFlatRows);
    }
  }, [selectedFlatRows]);

  return (
    <>
      <TableContainer>
        <TableChakra {...getTableProps()} {...props.tableContainerProps}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                  >
                    <HStack display='flex' justifyContent='space-between'>
                      <chakra.span>{column.render('Header')}</chakra.span>
                      {column.canSort && (
                        <chakra.span pl='4'>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <BsArrowDown aria-label='sorted descending' />
                            ) : (
                              <BsArrowUp aria-label='sorted ascending' />
                            )
                          ) : (
                            <BsArrowDownUp />
                          )}
                        </chakra.span>
                      )}
                    </HStack>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {!isLoading && !rows.length > 0 && (
              <Tr>
                {/* TODO: verificar se tem plugin e somar ou não */}
                <Th bg='blackAlpha.50' colSpan='100%'>
                  <Center>Nenhum registo encontrado</Center>
                </Th>
              </Tr>
            )}

            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td
                      {...cell.getCellProps()}
                      isNumeric={cell.column.isNumeric}
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
          {tfoot && tfoot}
        </TableChakra>
      </TableContainer>
      {pagination !== false && !disablePagination && (
        <Flex w='full' p={2} alignItems='center' justifyContent='center'>
          <Pagination
            defaultCurrent={pagination.current_page}
            total={pagination.total || 1}
            showTotal={() => <div>{pagination.total} registos </div>}
            hideOnSinglePage={false}
            pageNeighbours={1}
            pageSize={pagination.per_page}
            paginationProps={{ display: 'flex' }}
            colorScheme='blue'
            onChange={(currentPage, totalPages, pageSize) =>
              setSearchParams({
                page: currentPage,
                perPage: pageSize,
                ...(searchParams.get('filterFields') && ({
                  filterFields: searchParams.get('filterFields')
                }))
              })
            }
            onShowSizeChange={(currentPage, size) =>
              setSearchParams({
                page: 1,
                perPage: size,
                ...(searchParams.get('filterFields') && ({
                  filterFields: searchParams.get('filterFields')
                }))
              })
            }
            showSizeChanger
            rounded='15px'
          />
        </Flex>
      )}
    </>
  );
};

Table.defaultProps = {
  hooks: []
};
