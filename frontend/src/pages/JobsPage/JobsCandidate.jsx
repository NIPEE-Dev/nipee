import React, { useState, useEffect } from "react";
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
  Spacer,
  useColorModeValue,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import ApplicationHistory from "./ApplicationHistory";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};

const periodMap = {
  N: "Noite",
  T: "Tarde",
  M: "Manhã",
  MN: "Integral",
};

const typeMap = {
  ES: "Estágio",
  EF: "FCT",
};

const mockJobs = [
  {
    id: "1",
    company_name: "Tech Solutions S.A.",
    function: "Desenvolvedor Frontend Sênior",
    description:
      "Buscamos um desenvolvedor frontend experiente em React, com foco em performance e usabilidade. Conhecimento em TypeScript, testes unitários e integração contínua são diferenciais.",
    isPublished: true,
    requiredProfile: "Ensino Superior em TI",
    maxApplications: 5,
    currentApplications: 2,
    status: "Open",
    location: "Lisboa, Portugal",
    period: "M",
    type: "EF",
    has_scholarship: "1",
    scholarship_value: 800.0,
    meal_voucher: 7.5,
  },
  {
    id: "2",
    company_name: "Data Insights Ltda.",
    function: "Analista de Dados Júnior",
    description:
      "Oportunidade para quem busca iniciar carreira em análise de dados, com SQL e Python. Perfil proativo e analítico.",
    isPublished: true,
    requiredProfile: "Ensino Superior em Estatística/Matemática",
    maxApplications: 3,
    currentApplications: 3,
    status: "Encerrada",
    location: "Porto, Portugal",
    period: "T",
    type: "EF",
    has_scholarship: "1",
    scholarship_value: 600.0,
    meal_voucher: 5.0,
  },
  {
    id: "3",
    company_name: "Creative Minds Studio",
    function: "Designer UI/UX Pleno",
    description:
      "Criação de interfaces intuitivas e agradáveis, com experiência em Figma e prototipagem. Necessário portfólio.",
    isPublished: true,
    requiredProfile: "Ensino Superior em Design",
    maxApplications: 10,
    currentApplications: 7,
    status: "Open",
    location: "Coimbra, Portugal",
    period: "MN",
    type: "EF",
    has_scholarship: "0",
    scholarship_value: 0,
    meal_voucher: 6.0,
  },
  {
    id: "4",
    company_name: "Global Tech Solutions",
    function: "Engenheiro de Software Backend",
    description:
      "Construção e manutenção de APIs robustas em Node.js ou Java. Experiência com microserviços e bancos de dados NoSQL.",
    isPublished: false,
    requiredProfile: "Ensino Superior em TI",
    maxApplications: 8,
    currentApplications: 0,
    status: "Open",
    location: "Braga, Portugal",
    period: "M",
    type: "EF",
    has_scholarship: "1",
    scholarship_value: 900.0,
    meal_voucher: 8.0,
  },
  {
    id: "5",
    company_name: "Marketing Digital Experts",
    function: "Estagiário de Marketing Digital",
    description:
      "Suporte na criação de campanhas e análise de métricas para redes sociais. Oportunidade de aprendizado em SEO e SEM.",
    isPublished: true,
    requiredProfile: "Ensino Superior Cursando Marketing",
    maxApplications: 5,
    currentApplications: 0,
    status: "Open",
    location: "Faro, Portugal",
    period: "T",
    type: "ES",
    has_scholarship: "1",
    scholarship_value: 400.0,
    meal_voucher: 4.0,
  },
  {
    id: "6",
    company_name: "AI Innovations Lab",
    function: "Cientista de Dados",
    description:
      "Análise de grandes volumes de dados e construção de modelos preditivos. Experiência com machine learning e deep learning.",
    isPublished: true,
    requiredProfile: "Ensino Superior em Estatística/Matemática",
    maxApplications: 2,
    currentApplications: 0,
    status: "Open",
    location: "Aveiro, Portugal",
    period: "MN",
    type: "ES",
    has_scholarship: "1",
    scholarship_value: 1200.0,
    meal_voucher: 9.0,
  },
];

const mockCandidate = {
  id: "candidate-123",
  profile: "Ensino Superior em TI",
  appliedJobs: ["2"],
};

const JobsCandidate = () => {
  const [jobs, setJobs] = useState([]);
  const [candidate, setCandidate] = useState(mockCandidate);
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  useEffect(() => {
    setJobs(mockJobs);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const isPublished = job.isPublished;
    const matchesProfile = job.requiredProfile === candidate.profile;
    const hasAvailableSlots = job.currentApplications < job.maxApplications;
    const isOpen = job.status === "Open";

    return isPublished && hasAvailableSlots && isOpen;
  });

  const handleApply = (jobId) => {
    if (candidate.appliedJobs.includes(jobId)) {
      toast({
        title: "Você já se candidatou a esta vaga!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.id === jobId) {
          const newCurrentApplications = job.currentApplications + 1;
          const newStatus =
            newCurrentApplications >= job.maxApplications
              ? "Encerrada"
              : "Open";

          return {
            ...job,
            currentApplications: newCurrentApplications,
            status: newStatus,
          };
        }
        return job;
      });
    });

    setCandidate((prevCandidate) => ({
      ...prevCandidate,
      appliedJobs: [...prevCandidate.appliedJobs, jobId],
    }));

    toast({
      title: "Candidatura realizada com sucesso!",
      description: "Boa sorte no processo seletivo!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
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
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
                Vagas Disponíveis para Você
              </Heading>
              <Text fontSize="lg" textAlign="center" color={textColor}>
                Encontre as melhores oportunidades que se encaixam no seu
                perfil.
              </Text>

              {filteredJobs.length === 0 ? (
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
                  {filteredJobs.map((job) => {
                    const remainingApplications =
                      job.maxApplications - job.currentApplications;
                    const hasApplied = candidate.appliedJobs.includes(job.id);
                    const canApply = remainingApplications > 0 && !hasApplied;

                    return (
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
                            {job.function}
                          </Heading>

                          <Flex align="center" fontSize="sm" color="gray.600">
                            <Icon as={FaBuilding} mr={2} />
                            <Text fontWeight="semibold">
                              {job.company_name || "Empresa não informada"}
                            </Text>
                          </Flex>

                          <Flex align="center" fontSize="sm" color="gray.600">
                            <Icon as={FaMapMarkerAlt} mr={2} />
                            <Text>{job.location || "Local não informado"}</Text>
                          </Flex>

                          <Flex align="center" fontSize="sm" color="gray.600">
                            <Icon as={FaClock} mr={2} />
                            <Text>
                              {periodMap[job.period] || "Período não informado"}
                            </Text>
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

                          {job.has_scholarship === "1" &&
                            job.scholarship_value > 0 && (
                              <Flex
                                align="center"
                                fontSize="sm"
                                color="gray.600"
                              >
                                <Icon as={FaMoneyBillWave} mr={2} />
                                <Text>
                                  Bolsa: {formatCurrency(job.scholarship_value)}
                                </Text>
                              </Flex>
                            )}
                          {job.meal_voucher > 0 && (
                            <Flex align="center" fontSize="sm" color="gray.600">
                              <Icon as={FaMoneyBillWave} mr={2} />
                              <Text>
                                Vale Refeição:{" "}
                                {formatCurrency(job.meal_voucher)}
                              </Text>
                            </Flex>
                          )}

                          <Text fontSize="sm" color="gray.500" mt={2}>
                            **Perfil Necessário:** {job.requiredProfile}
                          </Text>

                          <Text
                            noOfLines={3}
                            fontSize="sm"
                            color={textColor}
                            mt={2}
                          >
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
                                remainingApplications <= 2 ? "red" : "green"
                              }
                              variant="subtle"
                              fontSize="0.8em"
                              py={1}
                              px={2}
                              borderRadius="full"
                              alignSelf="flex-start"
                            >
                              {remainingApplications} candidaturas restantes
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
                              isDisabled={!canApply}
                              width="100%"
                            >
                              {hasApplied ? "Já Candidatado" : "Candidatar-me"}
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
                    );
                  })}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <ApplicationHistory/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default JobsCandidate;
