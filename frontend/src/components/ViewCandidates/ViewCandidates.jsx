import React from 'react';
import { Spinner } from '@chakra-ui/react';
import Resource from '../Resource/Resource';
import { Table } from '../Table/Table';
import { dateFormatter } from '../../utils/visualization';

const ViewCandidates = ({ job, status, actionColumns = [] }) => (
  <Resource
    resource='Candidates'
    resourceParams={{ job, status }}
    preventParamsFromSearch
    autoFetch
  >
    {({ isLoading, records, setRecords, pagination }) => (
      <>
        {records.length === 0 && isLoading && (
          <Spinner isLoading={records.length === 0 && isLoading} />
        )}

        <Table
          columns={[
            ...actionColumns({ records, setRecords }),
            {
              Header: 'ID',
              accessor: 'id'
            },
            {
              Header: 'Data Registo',
              accessor: (originalData) =>
                dateFormatter(
                  originalData.created_at,
                  'DD-MM-YYYY HH:mm:ss',
                  'YYYY-MM-DDTHH:mm:ss.SSSSSSz'
                )
            },
            {
              Header: 'Nome',
              accessor: 'name'
            },
            {
              Header: 'Gênero',
              accessor: 'gender_title'
            },
            {
              Header: 'Data de nascimento',
              accessor: 'birth_day'
            },
            {
              Header: 'Cidade',
              accessor: 'address.city'
            },
            {
              Header: 'Bairro',
              accessor: 'address.district'
            },
            {
              Header: 'Telemóvel',
              accessor: 'contact.phone'
            },
            {
              Header: 'Período',
              accessor: 'period'
            },
            {
              Header: 'Semestre',
              accessor: 'semester'
            },
            {
              Header: 'Escola',
              accessor: 'school.corporate_name'
            }
          ]}
          isLoading={isLoading}
          pagination={pagination}
          records={records}
        />
      </>
    )}
  </Resource>
);

export default ViewCandidates;
