import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Button,
  useColorModeValue,
  useToast,
  Badge,
  SimpleGrid,
  Divider,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const makeJourneyText = (workingDay) => {
  if (!workingDay || !workingDay.start_weekday || !workingDay.end_weekday) {
    return null;
  }

  const startDay = weekDays[parseInt(workingDay.start_weekday) - 1];
  const endDay = weekDays[parseInt(workingDay.end_weekday) - 1];
  const startTime = workingDay.start_hour;
  const endTime = workingDay.end_hour;
  const workingHours = workingDay.working_hours;

  let journeyText = `Jornada de ${startDay} a ${endDay}`;
  if (startTime && endTime) {
    journeyText += `, das ${startTime} às ${endTime}`;
  }
  if (workingHours) {
    journeyText += ` (${workingHours} horas semanais)`;
  }

  let exceptionText = "";
  if (
    workingDay.day_off_start_weekday &&
    workingDay.day_off_start_hour &&
    workingDay.day_off_end_hour
  ) {
    const dayOffStartDay =
      weekDays[parseInt(workingDay.day_off_start_weekday) - 1];
    exceptionText = `Exceção: ${dayOffStartDay}, das ${workingDay.day_off_start_hour} às ${workingDay.day_off_end_hour}.`;
  }
  if (workingDay.day_off) {
    exceptionText += ` Folga: ${workingDay.day_off}.`;
  }

  return (
    <Box mt={4}>
      <Text fontSize="md" color="gray.600">
        **Jornada de Trabalho:** {journeyText}
      </Text>
      {exceptionText && (
        <Text fontSize="sm" color="gray.500" mt={1}>
          {exceptionText}
        </Text>
      )}
    </Box>
  );
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return dateString; 
  }
};

const mockJobs = [
  {
    id: "1",
    company_id: "comp-1",
    company_name: "Tech Solutions S.A.", 
    function: "Desenvolvedor Frontend Sênior",
    period: "M",
    courses: ["101", "102"], 
    course_names: ["Engenharia de Software", "Ciência da Computação"], 
    required_skills:
      "Experiência em React, TypeScript, testes unitários, integração contínua. Foco em performance e usabilidade. Conhecimento em metodologias ágeis.",
    location: "Lisboa, Portugal",
    start_date: "2025-08-01",
    end_date: "2026-02-28",
    available: 5, 
    currentApplications: 2,
    gender: "FM",
    transport_voucher: "1",
    transport_voucher_value: 50.0,
    transport_voucher_nominal_value: "50.00",
    has_scholarship: "1",
    scholarship_value: 800.0,
    scholarship_nominal_value: "800.00",
    meal_voucher: 7.5,
    type: "ES",
    show_web: "1",
    description:
      "Buscamos um desenvolvedor frontend experiente em React, com foco em performance e usabilidade. Conhecimento em TypeScript, testes unitários e integração contínua são diferenciais. Ambiente dinâmico e colaborativo com foco em inovação. Responsabilidades incluem desenvolvimento de novas funcionalidades, manutenção de código existente e participação em code reviews.",
    working_day: {
      start_weekday: "2",
      end_weekday: "6", 
      start_hour: "09:00",
      end_hour: "18:00",
      day_off_start_weekday: "", 
      day_off_start_hour: "",
      day_off_end_hour: "",
      day_off: "Fins de semana",
      working_hours: 40,
    },
    status: "Open",
    isPublished: true, 
    requiredProfile: "Ensino Superior em TI", 
  },
  {
    id: "2",
    company_id: "comp-2",
    company_name: "Data Insights Ltda.",
    function: "Analista de Dados Júnior",
    period: "T",
    courses: ["103"],
    course_names: ["Estatística"],
    required_skills:
      "SQL, Python (Pandas, NumPy). Interesse em análise exploratória de dados e visualização. Perfil proativo e analítico.",
    location: "Porto, Portugal",
    start_date: "2025-09-15",
    end_date: "2026-03-15",
    available: 3,
    currentApplications: 3,
    gender: "FM",
    transport_voucher: "0",
    transport_voucher_value: 0,
    transport_voucher_nominal_value: "0",
    has_scholarship: "1",
    scholarship_value: 600.0,
    scholarship_nominal_value: "600.00",
    meal_voucher: 5.0,
    type: "EF",
    show_web: "1",
    description:
      "Oportunidade para quem busca iniciar carreira em análise de dados. Responsabilidades incluem coleta, limpeza e análise de dados, criação de relatórios e dashboards. Mentoria e aprendizado contínuo garantidos.",
    working_day: {
      start_weekday: "2",
      end_weekday: "6",
      start_hour: "14:00",
      end_hour: "18:00",
      day_off_start_weekday: "",
      day_off_start_hour: "",
      day_off_end_hour: "",
      day_off: "Fins de semana",
      working_hours: 20,
    },
    status: "Encerrada",
    isPublished: true,
    requiredProfile: "Ensino Superior em Estatística/Matemática",
  },
  {
    id: "3",
    company_id: "comp-3",
    company_name: "Creative Minds Studio",
    function: "Designer UI/UX Pleno",
    period: "M",
    courses: ["104"],
    course_names: ["Design de Comunicação"],
    required_skills:
      "Figma, Adobe XD, prototipagem, design system. Foco em usabilidade e experiência do usuário. Portfólio é essencial.",
    location: "Coimbra, Portugal",
    start_date: "2025-10-01",
    end_date: "2026-04-30",
    available: 10,
    currentApplications: 7,
    gender: "FM",
    transport_voucher: "1",
    transport_voucher_value: 30.0,
    transport_voucher_nominal_value: "30.00",
    has_scholarship: "0",
    scholarship_value: 0,
    scholarship_nominal_value: "0",
    meal_voucher: 6.0,
    type: "ES",
    show_web: "1",
    description:
      "Criação de interfaces intuitivas e agradáveis, com experiência em Figma e prototipagem. Buscamos alguém criativo e que se preocupe com a experiência do usuário do início ao fim do processo. Colaboração com equipes de desenvolvimento e produto.",
    working_day: {
      start_weekday: "2",
      end_weekday: "6",
      start_hour: "09:00",
      end_hour: "17:00",
      day_off_start_weekday: "",
      day_off_start_hour: "",
      day_off_end_hour: "",
      day_off: "Fins de semana",
      working_hours: 35,
    },
    status: "Open",
    isPublished: true,
    requiredProfile: "Ensino Superior em Design",
  },
];

const mockCandidate = {
  id: "candidate-123",
  profile: "Ensino Superior em TI",
  appliedJobs: ["2"],
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [candidate, setCandidate] = useState(mockCandidate);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  useEffect(() => {
    const foundJob = mockJobs.find((j) => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
    } else {
      toast({
        title: "Vaga não encontrada.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/jobs");
    }
  }, [jobId, navigate, toast]);

  const handleApply = (currentJob) => {
    if (!currentJob) return;

    if (candidate.appliedJobs.includes(currentJob.id)) {
      toast({
        title: "Você já se candidatou a esta vaga!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const newCurrentApplications = currentJob.currentApplications + 1;
    const newStatus =
      newCurrentApplications >= currentJob.available ? "Encerrada" : "Open"; 

    const updatedJob = {
      ...currentJob,
      currentApplications: newCurrentApplications,
      status: newStatus,
    };
    setJob(updatedJob);

    setCandidate((prevCandidate) => ({
      ...prevCandidate,
      appliedJobs: [...prevCandidate.appliedJobs, currentJob.id],
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

  if (!job) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Text fontSize="xl" color={textColor}>
          Carregando detalhes da vaga...
        </Text>
      </Container>
    );
  }

  const periodMap = {
    N: "Noite",
    T: "Tarde",
    M: "Manhã",
    MN: "Integral",
  };

  const genderMap = {
    F: "Feminino",
    M: "Masculino",
    FM: "Ambos",
  };

  const typeMap = {
    ES: "Estágio",
    EF: "FCT",
  };

  const yesNoMap = {
    0: "Não",
    1: "Sim",
  };

  const remainingApplications = job.available - job.currentApplications;
  const hasApplied = candidate.appliedJobs.includes(job.id);
  const canApply =
    remainingApplications > 0 && !hasApplied && job.status === "Open";

  return (
    <Container maxW="container.xl" py={10}>
      <VStack
        spacing={6}
        align="stretch"
        p={6}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={cardBg}
        borderColor={accentColor}
      >
        <Button
          onClick={() => navigate("/jobs")}
          variant="outline"
          colorScheme="purple"
          alignSelf="flex-start"
        >
          ← Voltar para as Vagas
        </Button>
        <Heading as="h1" size="xl" color={accentColor}>
          {job.function}
        </Heading>
        <Text fontSize="lg" color="gray.500">
          **Empresa:** {job.company_name || "N/A"}
        </Text>
        <Text fontSize="md" color={textColor} whiteSpace="pre-wrap">
          {job.description}
        </Text>

        <Divider borderColor="gray.300" />

        {/* Informações da Vaga */}
        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Detalhes da Vaga
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Período:
            </Text>
            <Text fontSize="md" color={textColor}>
              {periodMap[job.period] || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Cursos Requeridos:
            </Text>
            <Text fontSize="md" color={textColor}>
              {job.course_names?.join(", ") || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Competências Requeridas:
            </Text>
            <Text fontSize="md" color={textColor} whiteSpace="pre-wrap">
              {job.required_skills || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Local de Realização:
            </Text>
            <Text fontSize="md" color={textColor}>
              {job.location || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Data de Início:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatDate(job.start_date)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Data de Fim:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatDate(job.end_date)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Sexo Preferencial:
            </Text>
            <Text fontSize="md" color={textColor}>
              {genderMap[job.gender] || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Tipo de Vaga:
            </Text>
            <Text fontSize="md" color={textColor}>
              {typeMap[job.type] || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Mostrar no Site:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[job.show_web] || "N/A"}
            </Text>
          </Box>
        </SimpleGrid>

        <Divider borderColor="gray.300" />

        {/* Benefícios */}
        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Benefícios
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Vale Transporte:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[job.transport_voucher] || "N/A"}
            </Text>
            {job.transport_voucher === "1" && (
              <>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {formatCurrency(job.transport_voucher_value)}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor Nominal:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {job.transport_voucher_nominal_value || "N/A"}
                </Text>
              </>
            )}
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Bolsa:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[job.has_scholarship] || "N/A"}
            </Text>
            {job.has_scholarship === "1" && (
              <>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor da Bolsa:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {formatCurrency(job.scholarship_value)}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor Nominal da Bolsa:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {job.scholarship_nominal_value || "N/A"}
                </Text>
              </>
            )}
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Vale Refeição:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatCurrency(job.meal_voucher)}
            </Text>
          </Box>
        </SimpleGrid>

        <Divider borderColor="gray.300" />

        {/* Dados da Jornada */}
        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Jornada de Trabalho
        </Heading>
        {makeJourneyText(job.working_day)}

        <Divider borderColor="gray.300" />

        {/* Status de Candidatura e Botão */}
        <Flex w="100%" align="center" mt={4}>
          <Badge
            colorScheme={
              remainingApplications <= 2 && job.status === "Open"
                ? "red"
                : "green"
            }
            variant="subtle"
            fontSize="1.0em"
            py={1}
            px={3}
            borderRadius="full"
          >
            {job.status === "Encerrada"
              ? "Vaga Encerrada"
              : `${remainingApplications} candidaturas restantes`}
          </Badge>
          {hasApplied && (
            <Badge
              ml={2}
              colorScheme="blue"
              variant="solid"
              fontSize="1.0em"
              py={1}
              px={3}
              borderRadius="full"
            >
              Você já se candidatou
            </Badge>
          )}
          <Spacer />
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => handleApply(job)}
            isDisabled={!canApply}
          >
            {hasApplied
              ? "Já Candidatado"
              : job.status === "Encerrada"
              ? "Vaga Encerrada"
              : "Candidatar-me"}
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default JobDetails;
