import React, { useEffect, useState } from 'react';
import _map from 'lodash/map';
import {
  Button,
  Divider,
  Spinner,
  Tooltip,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  HStack,
  useToast,
  VStack,
  StackDivider,
  Link
} from '@chakra-ui/react';
import {
  MdClose,
  MdKeyboardBackspace,
  MdOutlineNavigateNext
} from 'react-icons/md';
import { useRowSelect } from 'react-table';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from '../Filters/Filters';
import Resource from '../Resource/Resource';
import { Table } from '../Table/Table';
import { rowSelectionHook } from '../../utils/formHelpers';
import { WithModal } from '../WithModal';
import { ModalConfirm } from '../WithModal/ModalConfirm';
import { handleCallCandidates } from '../../store/ducks/jobs';
import { citiesFilters } from '../../utils/filterHelpers';
import Card from '../Card/Card';
import getRoute from '../../utils/getRoute';
import routes from '../../routes';
import { dateFormatter } from '../../utils/visualization';

const ChooseCandidates = ({ handleCallCandidates }) => {
  let navigate = useNavigate();
  let location = useLocation();

  const [jobsSelected, setJobsSelected] = useState([]);
  const [candidatesSelected, setCandidatesSelected] = useState([]);

  const toast = useToast();

  useEffect(() => {
    if (location.state) {
      setJobsSelected(location.state.jobs);
    }
  }, [location.state]);

  const removeJob = (job) => {
    setJobsSelected((currentJobsSelected) =>
      currentJobsSelected.filter((jobSelected) => jobSelected.id !== job.id)
    );
  };

  const callCandidates = () => {
    const jobs = _map(jobsSelected, 'original.id');
    const candidates = _map(candidatesSelected, 'original.id');

    handleCallCandidates({
      jobs,
      candidates
    }).then(() =>
      toast({
        title: 'Sucesso!',
        description: `Candidatos foram chamados com êxito!`,
        variant: 'left-accent',
        duration: 9000,
        isClosable: true,
        position: 'top',
        status: 'success',
        containerStyle: {
          marginTop: '96px'
        }
      })
    );
  };

  const updateSelectedCandidates = (newSelectedCandidates) => {
    if (candidatesSelected.length !== newSelectedCandidates.length) {
      setCandidatesSelected(newSelectedCandidates);
    }
  };

  return (
    <Card>
      <VStack
        spacing={4}
        align='stretch'
        divider={<StackDivider borderColor='gray.200' />}
      >
        <HStack>
          <MdKeyboardBackspace
            size={24}
            cursor='pointer'
            onClick={() => navigate('..', {})}
          />
          <Text mb='3' align='left' fontSize='3xl'>
            Escolher candidato
          </Text>
        </HStack>

        {jobsSelected.length > 0 && (
          <>
            <HStack alignItems='center'>
              <Text fontSize='sm'>Vagas selecionadas: </Text>
              <div>
                {jobsSelected.map((job) => (
                  <Tag
                    m={1}
                    size='sm'
                    key={job.index}
                    variant='outline'
                    colorScheme='blue'
                  >
                    <TagLabel>
                      {job.original.company.corporate_name} -{' '}
                      {job.original.role.title} - €{' '}
                      {job.original.scholarship_value}
                    </TagLabel>
                    {jobsSelected.length > 1 && (
                      <TagRightIcon
                        as={MdClose}
                        onClick={() => removeJob(job)}
                        cursor='pointer'
                      />
                    )}
                  </Tag>
                ))}
              </div>
            </HStack>

            <Divider m={3} />
          </>
        )}

        <Resource
          resource='Candidates'
          autoFetch
          resourceParams={{
            type: 'elegible'
          }}
        >
          {({ isLoading, records, pagination }) => (
            <>
              <Filters
                filters={[
                  {
                    field: 'name',
                    header: 'Nome do candidato'
                  },
                  {
                    field: 'tags',
                    header: 'Palavras Chaves',
                    serverType: 'like'
                  },
                  ...citiesFilters
                ]}
              />

              <Divider mt={5} />

              {records.length === 0 && isLoading && (
                <Spinner isLoading={records.length === 0 && isLoading} />
              )}

              <Table
                columns={[
                  {
                    Header: 'ID',
                    accessor: 'id'
                  },
                  {
                    Header: 'Data de Registo',
                    accessor: (originalData) =>
                      dateFormatter(originalData.created_at)
                  },
                  {
                    Header: 'Nome',
                    accessor: (originalRow) => (
                      <Link
                        href={`/${getRoute(routes.candidates.view, {
                          id: originalRow.id
                        })}`}
                        isExternal
                      >
                        {originalRow.name}
                      </Link>
                    )
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
                    Header: 'CEP',
                    accessor: 'address.cep'
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
                hooks={[useRowSelect, rowSelectionHook()]}
                onSelectRowsChange={(rowSelectedCandidates) =>
                  updateSelectedCandidates(rowSelectedCandidates)
                }
                isLoading={isLoading}
                pagination={pagination}
                records={records}
              />

              <WithModal
                modal={({ closeModal }) => (
                  <ModalConfirm
                    text='Essa ação irá enviar um email para os candidatos selecionados'
                    onConfirm={() => {
                      callCandidates();

                      navigate('..');
                      closeModal();
                    }}
                    onCancel={closeModal}
                  />
                )}
              >
                {({ toggleModal }) => (
                  <Button
                    onClick={toggleModal}
                    colorScheme='teal'
                    rightIcon={<MdOutlineNavigateNext />}
                    disabled={candidatesSelected.length === 0}
                  >
                    Chamar candidatos
                  </Button>
                )}
              </WithModal>
            </>
          )}
        </Resource>
      </VStack>
    </Card>
  );
};

export default connect(null, {
  handleCallCandidates
})(ChooseCandidates);
