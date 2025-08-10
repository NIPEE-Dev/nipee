import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  chakra,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Badge,
  Flex, 
} from '@chakra-ui/react';

const mockCandidates = [
  {
    id: 'cand-1',
    name: 'Ana Silva',
    resume_url: '[https://example.com/curriculo_ana.pdf](https://example.com/curriculo_ana.pdf)',
    gender: 'F',
    course: 'Engenharia de Software',
    location: 'Lisboa',
    council: 'Lisboa',
    mobile: '+351 912345678',
  },
  {
    id: 'cand-2',
    name: 'Bruno Costa',
    resume_url: '[https://example.com/curriculo_bruno.pdf](https://example.com/curriculo_bruno.pdf)',
    gender: 'M',
    course: 'Ciência da Computação',
    location: 'Porto',
    council: 'Porto',
    mobile: '+351 934567890',
  },
  {
    id: 'cand-3',
    name: 'Carla Dias',
    resume_url: '[https://example.com/curriculo_carla.pdf](https://example.com/curriculo_carla.pdf)',
    gender: 'F',
    course: 'Design Gráfico',
    location: 'Coimbra',
    council: 'Coimbra',
    mobile: '+351 965432109',
  },
  {
    id: 'cand-4',
    name: 'Diogo Pires',
    resume_url: '[https://example.com/curriculo_diogo.pdf](https://example.com/curriculo_diogo.pdf)',
    gender: 'M',
    course: 'Marketing Digital',
    location: 'Faro',
    council: 'Faro',
    mobile: '+351 921098765',
  },
];

const mockCandidaciesData = [
  {
    id: 'app-101',
    candidateId: 'cand-1',
    applicationDate: '2025-07-10T10:30:00Z',
    status: 'Em Análise',
  },
  {
    id: 'app-102',
    candidateId: 'cand-2',
    applicationDate: '2025-07-11T11:00:00Z',
    status: 'Em Análise',
  },
  {
    id: 'app-103',
    candidateId: 'cand-3',
    applicationDate: '2025-07-08T15:00:00Z',
    status: 'Aprovado',
  },
  {
    id: 'app-104',
    candidateId: 'cand-4',
    applicationDate: '2025-07-09T09:30:00Z',
    status: 'Reprovado',
  },
];

const getEnrichedFixedCandidacies = () => {
  return mockCandidaciesData.map(app => {
    const candidate = mockCandidates.find(cand => cand.id === app.candidateId);
    return {
      ...app,
      candidateDetails: candidate,
    };
  });
};

const CandidacyTable = ({
  typeForm,
  readOnly = false,
  documents: documentsList, 
  thContent
}) => {
  const toast = useToast();
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    setDocuments(documentsList);
  }, [documentsList]);

  const fixedCandidacies = getEnrichedFixedCandidacies();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'yellow';
      case 'Aprovado':
        return 'green';
      case 'Reprovado':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleApprove = () => {
    toast({ title: `Candidatura aprovada! (Simulação)`, status: 'success', duration: 2000 });
  };

  const handleReprove = () => {
    toast({ title: `Candidatura reprovada! (Simulação)`, status: 'error', duration: 2000 });
  };

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th width='1px'>{thContent}</Th>
            <Th>Nome</Th>
            <Th>Currículo</Th>
            <Th>Género</Th>
            <Th>Curso</Th>
            <Th>Localidade</Th>
            <Th>Conselho</Th>
            <Th>Telemóvel</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fixedCandidacies.length === 0 ? (
            <Tr>
              <Td colSpan={10} textAlign="center">
                Nenhum candidato se candidatou a esta vaga ainda.
              </Td>
            </Tr>
          ) : (
            fixedCandidacies.map((app) => (
              <Tr key={app.id}>
                <Td width='1px'></Td>
                <Td>{app.candidateDetails?.name || 'N/A'}</Td>
                <Td>
                  {app.candidateDetails?.resume_url ? (
                    <Link href={app.candidateDetails.resume_url} isExternal color="purple.500">
                      Ver Currículo
                    </Link>
                  ) : (
                    'N/A'
                  )}
                </Td>
                <Td>{app.candidateDetails?.gender === 'F' ? 'Feminino' : app.candidateDetails?.gender === 'M' ? 'Masculino' : 'N/A'}</Td>
                <Td>{app.candidateDetails?.course || 'N/A'}</Td>
                <Td>{app.candidateDetails?.location || 'N/A'}</Td>
                <Td>{app.candidateDetails?.council || 'N/A'}</Td>
                <Td>{app.candidateDetails?.mobile || 'N/A'}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(app.status)} px={2} py={1} borderRadius="full">
                    {app.status}
                  </Badge>
                </Td>
                <Td>
                  {readOnly && (
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleApprove(app.id)}
                        isDisabled={app.status === 'Aprovado' || app.status === 'Reprovado'}
                        mr={2}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleReprove(app.id)}
                        isDisabled={app.status === 'Aprovado' || app.status === 'Reprovado'}
                      >
                        Reprovar
                      </Button>
                    </Flex>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CandidacyTable;
