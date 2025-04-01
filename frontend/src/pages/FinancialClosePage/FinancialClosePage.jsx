import React from 'react';
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { RiDraftFill } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { FinancialForm as Form } from '../../forms/FinancialForm/FinancialForm';
import { FinancialDraftForm } from '../../forms/FinancialForm/FinancialDraftForm';
import routes from '../../routes';
import { dateFormatter, moneyFormatter } from '../../utils/visualization';

const FinancialClosePage = () => (
  <ResourceScreen
    title='Listagem de Fechamentos'
    permissions={['']}
    resource='FinancialClose'
    routeBase={routes.financial.close}
    Form={Form}
    Details={FinancialDraftForm}
    Edit={FinancialDraftForm}
    columns={[
      {
        id: 'status',
        Header: 'Status',
        accessor: (originalRow) => {
          const types = [
            <Tag variant='subtle' colorScheme='orange'>
              <TagLeftIcon boxSize='12px' as={RiDraftFill} />
              <TagLabel>Rascunho</TagLabel>
            </Tag>,
            <Tag variant='subtle' colorScheme='green'>
              <TagLeftIcon boxSize='12px' as={FaCheck} />
              <TagLabel>Gerado</TagLabel>
            </Tag>,
          ];

          return types[originalRow.status];
        },
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Valor total',
        accessor: (originalRow) => moneyFormatter(originalRow.total),
      },
      {
        id: 'reference_date',
        Header: 'Mês de referência',
        accessor: 'reference_date'
      },
      {
        Header: 'Criado em',
        accessor: 'created_at',
      },
    ]}
  />
);

export default FinancialClosePage;
