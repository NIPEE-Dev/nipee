import React, { useEffect } from "react";
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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "./../../hooks/useJobs";

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
  if (!workingDay || workingDay.start_weekday == null || workingDay.end_weekday == null) {
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
      <Text fontSize="md" color="gray.600" whiteSpace="pre-wrap">
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
  } catch {
    return dateString;
  }
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { jobDetail, loading, errorMessage, successMessage, fetchJobDetail, applyForJob, clearMessages } = useJobs();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  useEffect(() => {
    if (jobId) {
      fetchJobDetail(jobId);
    }
  }, [jobId, fetchJobDetail]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Sucesso!",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      clearMessages();
    }
    if (errorMessage) {
      toast({
        title: "Erro.",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      clearMessages();
    }
  }, [successMessage, errorMessage, clearMessages, toast]);

  if (loading) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Spinner size="xl" color={accentColor} />
        <Text fontSize="xl" color={textColor} mt={4}>
          Carregando detalhes da vaga...
        </Text>
      </Container>
    );
  }

  if (!jobDetail) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Vaga não encontrada.
        </Alert>
        <Button
          onClick={() => navigate("/jobs")}
          mt={4}
          variant="outline"
          colorScheme="purple"
        >
          Voltar para Vagas
        </Button>
      </Container>
    );
  }

  const periodTitle = jobDetail.period_title || "N/A";
  const typeMap = {
    ES: "Estágio",
    EF: "FCT",
  };
  const typeTitle = typeMap[jobDetail.type] || "N/A";

  const yesNoMap = {
    0: "Não",
    1: "Sim",
  };

  const remainingApplications = jobDetail.available_candidatures;
  const isOpen = jobDetail.status === 1;
  const hasApplied = jobDetail.already_applied;

  const canApply = isOpen && remainingApplications > 0 && !hasApplied;

  const handleApply = () => {
    if (!canApply) return;
    applyForJob(jobId);
  };

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
          {jobDetail.role || "N/A"}
        </Heading>
        <Text fontSize="lg" color="gray.500">
          <strong>Empresa:</strong> {jobDetail.fantasy_name || jobDetail.company || "N/A"}
        </Text>
        <Text fontSize="md" color={textColor} whiteSpace="pre-wrap" mt={2}>
          {jobDetail.description || "N/A"}
        </Text>

        <Divider borderColor="gray.300" />

        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Detalhes da Vaga
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Período:
            </Text>
            <Text fontSize="md" color={textColor}>
              {periodTitle}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Local de Trabalho:
            </Text>
            <Text fontSize="md" color={textColor}>
              {jobDetail.location || "N/A"}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Data de Início:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatDate(jobDetail.start_at)}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Data de Término:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatDate(jobDetail.end_at)}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Tipo de Vaga:
            </Text>
            <Text fontSize="md" color={textColor}>
              {typeTitle}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Mostrar no site:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[jobDetail.show_web] || "N/A"}
            </Text>
          </Box>
        </SimpleGrid>

        <Divider borderColor="gray.300" />

        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Benefícios
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Vale Transporte:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[jobDetail.transport_voucher] || "N/A"}
            </Text>
            {jobDetail.transport_voucher === "1" && (
              <>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {formatCurrency(jobDetail.transport_voucher_value)}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor Nominal:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {jobDetail.transport_voucher_nominal_value || "N/A"}
                </Text>
              </>
            )}
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Bolsa:
            </Text>
            <Text fontSize="md" color={textColor}>
              {yesNoMap[jobDetail.scholarship_value > 0 ? 1 : 0] || "N/A"}
            </Text>
            {jobDetail.scholarship_value > 0 && (
              <>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor da Bolsa:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {formatCurrency(jobDetail.scholarship_value)}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Valor Nominal da Bolsa:
                </Text>
                <Text fontSize="md" color={textColor}>
                  {jobDetail.scholarship_nominal_value || "N/A"}
                </Text>
              </>
            )}
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Vale Refeição:
            </Text>
            <Text fontSize="md" color={textColor}>
              {formatCurrency(jobDetail.meal_voucher)}
            </Text>
          </Box>
        </SimpleGrid>

        <Divider borderColor="gray.300" />

        <Heading as="h2" size="md" color={accentColor} mt={4}>
          Jornada de Trabalho
        </Heading>
        {makeJourneyText(jobDetail.working_day)}

        <Divider borderColor="gray.300" />
        
        <Box>
          <Heading as="h2" size="md" color={accentColor}>
            Competências
          </Heading>
          <Text fontSize="md" color={textColor} mt={2}>
            {jobDetail.competences || "Não informadas"}
          </Text>
        </Box>

        <Flex w="100%" align="center" mt={4}>
          <Badge
            colorScheme={
              remainingApplications <= 2 && isOpen ? "red" : "green"
            }
            variant="subtle"
            fontSize="1.0em"
            py={1}
            px={3}
            borderRadius="full"
          >
            {isOpen
              ? `${remainingApplications} candidaturas restantes`
              : "Vaga Encerrada"}
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
            onClick={handleApply}
            isDisabled={!canApply || loading}
            isLoading={loading}
          >
            {hasApplied
              ? "Já Candidatado"
              : !isOpen
              ? "Vaga Encerrada"
              : "Candidatar-me"}
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default JobDetails;
