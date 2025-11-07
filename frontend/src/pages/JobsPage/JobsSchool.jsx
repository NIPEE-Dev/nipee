import React, { useState } from 'react';
import _map from 'lodash/map';
import ResourceScreen from '../../components/ResourceScreen/ResourceScreen';
import { JobsForm as Form } from '../../forms/JobsForm/JobsForm';
import routes from '../../routes';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Stack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { BsBuilding, BsPersonBadge } from 'react-icons/bs';

const JobsSchool = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEscola = userRole === 'Escola';

  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithContent = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const statusColorMap = {
    Pendente: 'yellow',
    'Esperando resposta': 'purple',
    'Em entrevista': 'blue',
    'Em teste': 'orange',
    Aprovado: 'green',
    Reprovado: 'red',
    'Entrevista rejeitada': 'red',
    1: 'yellow',
    4: 'purple',
    5: 'blue',
    7: 'orange',
    2: 'green',
    3: 'red',
    6: 'red',
  };

  const getStatusLabel = (status) => {
    const labels = {
      '1': 'Pendente',
      '2': 'Aprovado',
      '3': 'Reprovado',
      '4': 'Esperando resposta',
      '5': 'Em entrevista',
      '6': 'Entrevista rejeitada',
      '7': 'Em teste',
    };
    return labels[status] || status || 'Desconhecido';
  };

  return (
    <>
      <ResourceScreen
        title="Vagas"
        permissions={['']}
        resource="Interviewing"
        routeBase={routes.interviewing}
        Form={Form}
        canEdit={!isEscola}
        canAdd={!isEscola}
        canRemove={false}
        canView={false}
        resourceListProps={{
          downloadButtonEnabled: false,
        }}
        columns={[
          {
            Header: 'Aluno',
            accessor: 'name',
          },
          {
            Header: 'Currículo',
            accessor: (originalRow) => {
              const filePath = `${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${originalRow.resume}`;
              
              return (
                <Link target='_blank' href={filePath}>
                  Currículo de {originalRow.name} 
                </Link>
              );
            }
          },
          {
            Header: 'Curso',
            accessor: 'course_title',
          },
          {
            Header: 'Localidade',
            accessor: 'address.city',
          },
          {
            Header: 'Conselho',
            accessor: 'address.district',
          },
          {
            Header: 'Telemóvel',
            accessor: 'contact.phone',
          },
          {
            Header: 'Situações',
            accessor: 'jobs_situations',
            Cell: ({ value: jobsSituations }) => {
              if (!jobsSituations || Object.keys(jobsSituations).length === 0) {
                return <span>Nenhuma</span>;
              }
              const numberOfJobs = Object.values(jobsSituations).flat().length;
              return (
                <Button onClick={() => openModalWithContent(jobsSituations)} colorScheme="purple" size="sm">
                  Ver Situações ({numberOfJobs})
                </Button>
              );
            },
          },
        ]}
      />

     <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <ModalHeader borderBottomWidth="1px" pb={2}>
          Situações de Vaga
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalContent && (
            <Stack spacing={6}>
              {Object.entries(modalContent).map(([status, jobs]) => (
                <Box key={status}>
                  <Flex align="center" mb={2} gap={2}>
                    <Badge
                      colorScheme={statusColorMap[status] || 'gray'}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontWeight="bold"
                    >
                      {getStatusLabel(status)}
                    </Badge>
                  </Flex>

                  <Box pl={6} borderLeft="2px solid" borderColor="gray.300">
                    <Stack spacing={3}>
                      {jobs.map((job, index) => (
                        <Box
                          key={index}
                          p={4}
                          bg="gray.50"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.200"
                        >
                          <Flex align="center" mb={1} gap={2}>
                            <Icon as={BsBuilding} color="purple.500" />
                            <Text fontWeight="bold" color="gray.700">
                              Empresa:
                            </Text>
                            <Text>{job.company}</Text>
                          </Flex>
                          <Flex align="center" gap={2}>
                            <Icon as={BsPersonBadge} color="purple.500" />
                            <Text fontWeight="bold" color="gray.700">
                              Função:
                            </Text>
                            <Text>{job.role}</Text>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </ModalBody>
        <ModalFooter borderTopWidth="1px" pt={2}>
          <Button onClick={closeModal} colorScheme="purple" variant="outline">
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};

export default JobsSchool;