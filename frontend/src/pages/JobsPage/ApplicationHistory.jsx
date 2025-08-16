import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from "./../../hooks/useJobs";

const ApplicationHistory = () => {
  const { myApplications, loading, errorMessage, getHistory, clearMessages } = useJobs();
  const toast = useToast();
  const navigate = useNavigate();

  const headerBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const accentColor = 'purple.500';

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Erro ao carregar histórico.",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      clearMessages();
    }
  }, [errorMessage, clearMessages, toast]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs-candidate/${jobId}`);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10} textAlign="center">
        <Spinner size="xl" color={accentColor} />
        <Text mt={4}>Carregando histórico de candidaturas...</Text>
      </Container>
    );
  }

  if (myApplications.length === 0) {
    return (
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        bg={useColorModeValue('white', 'gray.700')}
        borderColor={accentColor}
        textAlign="center"
      >
        <Text fontSize="xl" color={textColor}>Você ainda não se candidatou a nenhuma vaga.</Text>
        <Text fontSize="md" color="gray.500">Comece a explorar as vagas disponíveis agora!</Text>
        <Button mt={4} colorScheme="purple" onClick={() => navigate('/jobs')}>
          Ver Vagas Disponíveis
        </Button>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
          Histórico de Candidaturas
        </Heading>
        <Text fontSize="lg" textAlign="center" color={textColor}>
          Visualize o status de todas as suas candidaturas.
        </Text>

        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr bg={headerBg}>
                <Th color={textColor}>Vaga</Th>
                <Th color={textColor}>Empresa</Th>
                <Th color={textColor}>Data da Candidatura</Th>
                <Th color={textColor}>Status</Th>
                <Th color={textColor}>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myApplications.map((app) => (
                <Tr key={app.id}>
                  <Td color={textColor}>{app.role || 'N/A'}</Td>
                  <Td color={textColor}>{app.company || 'N/A'}</Td>
                  <Td color={textColor}>{formatDate(app.appliedAt)}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(app.status)} px={2} py={1} borderRadius="full">
                      {getStatusLabel(app.status) || 'Em Análise'}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      onClick={() => handleViewDetails(app.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default ApplicationHistory;
