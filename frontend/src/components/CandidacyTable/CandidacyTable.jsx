import React from 'react';
import {
  Button,
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
  Link,
  Text,
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';

const getStatusColor = (status) => {
    switch (status) {
      case '1':
        return 'yellow';
      case '2':
        return 'green';
      case '3':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case '1':
        return 'Pendente';
      case '2':
        return 'Aprovado';
      case '3':
        return 'Reprovado';
      default:
        return 'Desconhecido';
    }
  };
  
const CandidacyTable = ({ candidates, readOnly = false }) => {
  const toast = useToast();

  const handleApprove = () => {
    toast({ title: `Candidato aprovado!`, status: 'success', duration: 2000 });
  };

  const handleReprove = () => {
    toast({ title: `Candidato reprovado!`, status: 'error', duration: 2000 });
  };

  return (
    <TableContainer>
      <Table variant='simple' size='sm'>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Currículo</Th>
            <Th>Género</Th>
            <Th>Curso</Th>
            <Th>Localidade</Th>
            <Th>Concelho</Th>
            <Th>Telemóvel</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {candidates && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <Tr key={candidate.id}>
                <Td>{candidate.name || 'N/A'}</Td>
                <Td>
                  {candidate.resume ? (
                    <Link
                      href={`${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${candidate.resume}`}
                      isExternal
                      color="purple.500"
                    >
                      <FaFilePdf size={20} />
                    </Link>
                  ) : (
                    <Text>Sem currículo</Text>
                  )}
                </Td>
                <Td>{candidate.gender === 'F' ? 'Feminino' : candidate.gender === 'M' ? 'Masculino' : 'N/A'}</Td>
                <Td>{candidate.course?.title || 'N/A'}</Td>
                <Td>{candidate.location || 'N/A'}</Td>
                <Td>{candidate.council || 'N/A'}</Td>
                <Td>{candidate.phone || 'N/A'}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(candidate.status)} px={2} py={1} borderRadius="full">
                    {candidate.status || 'Desconhecido'}
                  </Badge>
                </Td>
                <Td>
                  {readOnly && (
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleApprove(candidate.id)}
                        isDisabled={candidate.status !== 'Pendente'}
                        mr={2}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleReprove(candidate.id)}
                        isDisabled={candidate.status !== 'Pendente'}
                      >
                        Reprovar
                      </Button>
                    </Flex>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={9} textAlign="center">
                <Text py={4}>Nenhum candidato se candidatou a esta vaga ainda.</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CandidacyTable;
