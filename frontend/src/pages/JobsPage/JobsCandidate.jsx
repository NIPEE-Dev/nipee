import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  useToast,
  Flex,
  useColorModeValue,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import ApplicationHistory from "./ApplicationHistory";
import { useJobs } from './../../hooks/useJobs';
import InvitesPage from "./InvitesPage";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};

const typeMap = {
  ES: "Estágio",
  EF: "FCT",
};

const JobsCandidate = () => {
  const { jobs, loading, errorMessage, successMessage, fetchJobs, applyForJob, clearMessages } = useJobs();
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchJobs();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchJobs]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Candidatura realizada com sucesso!",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      fetchJobs();
      clearMessages();
    }
    if (errorMessage) {
      toast({
        title: "Erro ao se candidatar.",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      clearMessages();
    }
  }, [successMessage, errorMessage, fetchJobs, clearMessages, toast]);

  const filteredJobs = jobs.filter(
    (job) => job.show_web === "1" && job.status === 1 && job.available_candidatures > 0
  );

  const handleApply = (jobId) => {
    applyForJob(jobId);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs-candidate/${jobId}`);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Tabs isLazy variant="soft-rounded" colorScheme="purple">
        <TabList justifyContent="center" mb={4}>
          <Tab>Vagas</Tab>
          <Tab>Histórico</Tab>
          <Tab>Convites</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
                Vagas Disponíveis para Você
              </Heading>
              <Text fontSize="lg" textAlign="center" color={textColor}>
                Encontre as melhores oportunidades que se encaixam no seu perfil.
              </Text>

              {loading && (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" color={accentColor} />
                  <Text mt={4}>Carregando vagas...</Text>
                </Box>
              )}

              {!loading && filteredJobs.length === 0 ? (
                <Box
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  bg={cardBg}
                  borderColor={accentColor}
                  textAlign="center"
                >
                  <Text fontSize="xl" color={textColor}>
                    Nenhuma vaga encontrada para o seu perfil no momento.
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    Volte mais tarde ou atualize seu perfil.
                  </Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredJobs.map((job) => (
                    <Box
                      key={job.id}
                      p={6}
                      shadow="md"
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={cardBg}
                      _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
                      transition="all 0.2s ease-in-out"
                      borderColor={accentColor}
                    >
                      <VStack align="start" spacing={3}>
                        <Heading as="h3" size="md" color={accentColor}>
                          {job.role || job.description}
                        </Heading>

                        <Flex align="center" fontSize="sm" color="gray.600">
                          <Icon as={FaBuilding} mr={2} />
                          <Text fontWeight="semibold">{job.company?.corporate_name || job.company?.fantasy_name}</Text>
                        </Flex>

                        <Flex align="center" fontSize="sm" color="gray.600">
                          <Icon as={FaMapMarkerAlt} mr={2} />
                          <Text>{job.location || "Local não informado"}</Text>
                        </Flex>

                        <Flex align="center" fontSize="sm" color="gray.600">
                          <Icon as={FaClock} mr={2} />
                          <Text>{job.period_title || "Período não informado"}</Text>
                          <Badge
                            ml={2}
                            colorScheme="purple"
                            variant="outline"
                            px={2}
                            borderRadius="full"
                          >
                            {typeMap[job.type] || "Tipo não informado"}
                          </Badge>
                        </Flex>

                        {job.scholarship_value > 0 && (
                          <Flex align="center" fontSize="sm" color="gray.600">
                            <Icon as={FaMoneyBillWave} mr={2} />
                            <Text>Bolsa: {formatCurrency(job.scholarship_value)}</Text>
                          </Flex>
                        )}

                        {job.meal_voucher > 0 && (
                          <Flex align="center" fontSize="sm" color="gray.600">
                            <Icon as={FaMoneyBillWave} mr={2} />
                            <Text>Vale Refeição: {formatCurrency(job.meal_voucher)}</Text>
                          </Flex>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          **Competências:** {job.competences || "Não informadas"}
                        </Text>

                        <Text noOfLines={3} fontSize="sm" color={textColor} mt={2}>
                          {job.description}
                        </Text>

                        <Flex
                          w="100%"
                          align="flex-end"
                          justifyContent="space-between"
                          mt={4}
                        >
                          <Badge
                            colorScheme={
                              job.available_candidatures <= 2 ? "red" : "green"
                            }
                            variant="subtle"
                            fontSize="0.8em"
                            py={1}
                            px={2}
                            borderRadius="full"
                            alignSelf="flex-start"
                          >
                            {job.available_candidatures} vagas restantes
                          </Badge>
                        </Flex>

                        <Flex
                          w="100%"
                          align="flex-end"
                          justifyContent="space-between"
                          mt={4}
                        >
                          <Button
                            colorScheme="purple"
                            size="sm"
                            onClick={() => handleApply(job.id)}
                            isDisabled={job.already_applied}
                            isLoading={loading}
                            width="100%"
                          >
                            {job.already_applied ? "Já Candidatado" : "Candidatar-me"}
                          </Button>
                          <Button
                            colorScheme="gray"
                            size="sm"
                            onClick={() => handleViewDetails(job.id)}
                            width="100%"
                          >
                            Ver Detalhes
                          </Button>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <ApplicationHistory />
          </TabPanel>
          <TabPanel>
            <InvitesPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default JobsCandidate;
