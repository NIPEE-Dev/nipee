import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const mockJobs = [
  {
    id: '1',
    company_name: 'Tech Solutions S.A.',
    function: 'Desenvolvedor Frontend Sênior',
    description: 'Buscamos um desenvolvedor frontend experiente em React, com foco em performance e usabilidade.',
    isPublished: true,
    requiredProfile: 'Ensino Superior em TI',
    maxApplications: 5,
    currentApplications: 2,
    status: 'Open',
    location: 'Lisboa, Portugal',
    period: 'M',
    type: 'ES',
    has_scholarship: '1',
    scholarship_value: 800.00,
    meal_voucher: 7.50,
  },
  {
    id: '2',
    company_name: 'Data Insights Ltda.',
    function: 'Analista de Dados Júnior',
    description: 'Oportunidade para quem busca iniciar carreira em análise de dados, com SQL e Python.',
    isPublished: true,
    requiredProfile: 'Ensino Superior em Estatística/Matemática',
    maxApplications: 3,
    currentApplications: 3,
    status: 'Encerrada',
    location: 'Porto, Portugal',
    period: 'T',
    type: 'EF',
    has_scholarship: '1',
    scholarship_value: 600.00,
    meal_voucher: 5.00,
  },
  {
    id: '3',
    company_name: 'Creative Minds Studio',
    function: 'Designer UI/UX Pleno',
    description: 'Criação de interfaces intuitivas e agradáveis, com experiência em Figma e prototipagem.',
    isPublished: true,
    requiredProfile: 'Ensino Superior em Design',
    maxApplications: 10,
    currentApplications: 7,
    status: 'Open',
    location: 'Coimbra, Portugal',
    period: 'MN',
    type: 'ES',
    has_scholarship: '0',
    scholarship_value: 0,
    meal_voucher: 6.00,
  },
  {
    id: '7',
    company_name: 'Future Innovations Inc.',
    function: 'Engenheiro de QA',
    description: 'Procuramos um Engenheiro de QA para garantir a qualidade de nossos produtos de software.',
    isPublished: true,
    requiredProfile: 'Ensino Superior em TI',
    maxApplications: 4,
    currentApplications: 1,
    status: 'Open',
    location: 'Funchal, Portugal',
    period: 'M',
    type: 'ES',
    has_scholarship: '1',
    scholarship_value: 700.00,
    meal_voucher: 6.00,
  },
];

const mockCandidateApplications = [
  {
    jobId: '1',
    applicationDate: '2025-07-10T10:30:00Z',
    status: 'Pendente',
  },
  {
    jobId: '2',
    applicationDate: '2025-07-05T14:00:00Z',
    status: 'Reprovado',
  },
  {
    jobId: '3',
    applicationDate: '2025-07-01T09:00:00Z',
    status: 'Aprovado',
  },
  {
    jobId: '7',
    applicationDate: '2025-07-18T11:45:00Z',
    status: 'Em Análise',
  },
];

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const headerBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const accentColor = 'purple.500';

  useEffect(() => {
    const enrichedApplications = mockCandidateApplications.map(app => {
      const job = mockJobs.find(j => j.id === app.jobId);
      return {
        ...app,
        jobDetails: job,
      };
    });
    setApplications(enrichedApplications);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'yellow';
      case 'Aprovado':
        return 'green';
      case 'Reprovado':
        return 'red';
      case 'Em Análise':
        return 'blue';
      default:
        return 'gray';
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

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
          Histórico de Candidaturas
        </Heading>
        <Text fontSize="lg" textAlign="center" color={textColor}>
          Visualize o status de todas as suas candidaturas.
        </Text>

        {applications.length === 0 ? (
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
        ) : (
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
                {applications.map((app) => (
                  <Tr key={app.jobId}>
                    <Td color={textColor}>{app.jobDetails?.function || 'Vaga Removida'}</Td>
                    <Td color={textColor}>{app.jobDetails?.company_name || 'N/A'}</Td>
                    <Td color={textColor}>{formatDate(app.applicationDate)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(app.status)} px={2} py={1} borderRadius="full">
                        {app.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="gray"
                        onClick={() => handleViewDetails(app.jobId)}
                        isDisabled={!app.jobDetails}
                      >
                        Ver Detalhes
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ApplicationHistory;
