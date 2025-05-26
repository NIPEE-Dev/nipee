import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Badge,
  Divider,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const initialMockSubmissions = [
  {
    id: "1",
    studentId: "aluno001",
    studentName: "Carlos Andrade",
    date: "2025-05-26",
    title: "Desenvolvimento UI",
    note: "Criação da tela de login.",
    hours: 4,
    status: "pending_approval",
    submissionTimestamp: new Date("2025-05-26T10:00:00Z"),
  },
  {
    id: "2",
    studentId: "aluno001",
    studentName: "Carlos Andrade",
    date: "2025-05-26",
    title: "Reunião de time",
    note: "Alinhamento semanal.",
    hours: 1,
    status: "pending_approval",
    submissionTimestamp: new Date("2025-05-26T14:00:00Z"),
  },
  {
    id: "3",
    studentId: "aluno002",
    studentName: "Beatriz Lima",
    date: "2025-05-27",
    title: "Pesquisa de UX",
    note: "Entrevistas com usuários.",
    hours: 6,
    status: "pending_approval",
    submissionTimestamp: new Date("2025-05-27T09:00:00Z"),
  },
  {
    id: "4",
    studentId: "aluno001",
    studentName: "Carlos Andrade",
    date: "2025-05-25",
    title: "Testes unitários",
    note: "Cobertura da classe Auth.",
    hours: 3,
    status: "approved",
    decisionTimestamp: new Date("2025-05-26T11:00:00Z"),
  },
  {
    id: "5",
    studentId: "aluno002",
    studentName: "Beatriz Lima",
    date: "2025-05-26",
    title: "Relatório de progresso",
    note: "Criação do relatório semanal.",
    hours: 2,
    status: "reproved",
    reprovalJustification: "Faltou incluir as métricas de engajamento.",
    decisionTimestamp: new Date("2025-05-27T15:00:00Z"),
  },
  {
    id: "6",
    studentId: "aluno003",
    studentName: "Daniel Costa",
    date: "2025-05-28",
    title: "Configuração de Ambiente",
    note: "Setup do Docker.",
    hours: 5,
    status: "pending_approval",
    submissionTimestamp: new Date("2025-05-28T11:00:00Z"),
  },
];

const ReportsCompany = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isOpen: isReproveModalOpen,
    onOpen: onReproveModalOpen,
    onClose: onReproveModalClose,
  } = useDisclosure();
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [reprovalReason, setReprovalReason] = useState("");
  const toast = useToast();

  useEffect(() => {
    setTimeout(() => {
      setSubmissions(initialMockSubmissions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (submissionId) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: "approved",
              decisionTimestamp: new Date(),
            }
          : sub
      )
    );
    toast({
      title: "Atividade Aprovada!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const openReproveModal = (submission) => {
    setCurrentSubmission(submission);
    setReprovalReason("");
    onReproveModalOpen();
  };

  const submitReproval = () => {
    if (!reprovalReason.trim()) {
      toast({
        title: "Justificativa obrigatória!",
        description: "Por favor, informe o motivo da reprovação.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === currentSubmission.id
          ? {
              ...sub,
              status: "reproved",
              reprovalJustification: reprovalReason,
              decisionTimestamp: new Date(),
            }
          : sub
      )
    );
    toast({
      title: "Atividade Reprovada!",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    onReproveModalClose();
  };

  const pendingSubmissionsGrouped = useMemo(() => {
    const pending = submissions.filter(
      (sub) => sub.status === "pending_approval"
    );
    return pending.reduce((acc, sub) => {
      const studentKey = sub.studentId + "_" + sub.studentName;
      if (!acc[studentKey]) {
        acc[studentKey] = { studentName: sub.studentName, dates: {} };
      }
      if (!acc[studentKey].dates[sub.date]) {
        acc[studentKey].dates[sub.date] = [];
      }
      acc[studentKey].dates[sub.date].push(sub);
      acc[studentKey].dates[sub.date].sort(
        (a, b) =>
          new Date(a.submissionTimestamp) - new Date(b.submissionTimestamp)
      );
      return acc;
    }, {});
  }, [submissions]);

  const historySubmissions = useMemo(() => {
    return submissions
      .filter((sub) => sub.status === "approved" || sub.status === "reproved")
      .sort(
        (a, b) => new Date(b.decisionTimestamp) - new Date(a.decisionTimestamp)
      );
  }, [submissions]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        Validação de Atividades dos Candidatos
      </Heading>
      <Tabs isLazy variant="soft-rounded" colorScheme="purple">
        <TabList justifyContent="center" mb={4}>
          <Tab>Pendentes de Aprovação</Tab>
          <Tab>Histórico de Decisões</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {Object.keys(pendingSubmissionsGrouped).length === 0 ? (
              <Text textAlign="center" p={5}>
                Nenhuma atividade pendente de aprovação no momento.
              </Text>
            ) : (
              <Accordion
                allowMultiple
                defaultIndex={Object.keys(pendingSubmissionsGrouped).map(
                  (_, i) => i
                )}
              >
                {Object.entries(pendingSubmissionsGrouped).map(
                  ([studentKey, studentData]) => (
                    <AccordionItem
                      key={studentKey}
                      mb={4}
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                    >
                      <h2>
                        <AccordionButton
                          _expanded={{ bg: "purple.100", color: "purple.700" }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            fontSize="lg"
                          >
                            {studentData.studentName}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4} bg="gray.50">
                        {Object.entries(studentData.dates)
                          .sort(
                            ([dateA], [dateB]) =>
                              new Date(dateA) - new Date(dateB)
                          )
                          .map(([date, activities]) => (
                            <Box key={date} mb={4}>
                              <Text
                                fontWeight="semibold"
                                fontSize="md"
                                mb={2}
                                borderBottomWidth="1px"
                                borderColor="gray.300"
                                pb={1}
                              >
                                Data:{" "}
                                {new Date(
                                  date + "T00:00:00"
                                ).toLocaleDateString("pt-BR", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                })}
                              </Text>
                              <VStack spacing={3} align="stretch">
                                {activities.map((activity) => (
                                  <Box
                                    key={activity.id}
                                    p={3}
                                    shadow="sm"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    bg="white"
                                  >
                                    <Heading size="sm" mb={1}>
                                      {activity.title}
                                    </Heading>
                                    <Text
                                      fontSize="sm"
                                      color="gray.600"
                                      noOfLines={2}
                                      mb={1}
                                    >
                                      Descrição: {activity.note || "N/A"}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mb={2}>
                                      Horas: {activity.hours}
                                    </Text>
                                    <HStack
                                      justifyContent="flex-end"
                                      spacing={3}
                                    >
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() =>
                                          openReproveModal(activity)
                                        }
                                        leftIcon={<FaTimesCircle />}
                                      >
                                        Reprovar
                                      </Button>
                                      <Button
                                        size="sm"
                                        colorScheme="green"
                                        onClick={() =>
                                          handleApprove(activity.id)
                                        }
                                        leftIcon={<FaCheckCircle />}
                                      >
                                        Aprovar
                                      </Button>
                                    </HStack>
                                  </Box>
                                ))}
                              </VStack>
                            </Box>
                          ))}
                      </AccordionPanel>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            )}
          </TabPanel>
          <TabPanel>
            {historySubmissions.length === 0 ? (
              <Text textAlign="center" p={5}>
                Nenhuma decisão no histórico ainda.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {historySubmissions.map((sub) => (
                  <Box
                    key={sub.id}
                    p={4}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    bg={sub.status === "approved" ? "green.50" : "red.50"}
                    borderColor={
                      sub.status === "approved" ? "green.200" : "red.200"
                    }
                  >
                    <HStack justifyContent="space-between" mb={2}>
                      <Heading size="sm">{sub.title}</Heading>
                      <Badge
                        colorScheme={
                          sub.status === "approved" ? "green" : "red"
                        }
                        fontSize="sm"
                      >
                        {sub.status === "approved" ? "Aprovado" : "Reprovado"}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm">
                      <strong>Candidato:</strong> {sub.studentName}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Data da Atividade:</strong>{" "}
                      {new Date(sub.date + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Horas:</strong> {sub.hours}
                    </Text>
                    {sub.note && (
                      <Text fontSize="sm" noOfLines={2}>
                        <strong>Descrição:</strong> {sub.note}
                      </Text>
                    )}
                    {sub.status === "reproved" && sub.reprovalJustification && (
                      <Text fontSize="sm" color="red.700" mt={1}>
                        <strong>Justificativa:</strong>{" "}
                        {sub.reprovalJustification}
                      </Text>
                    )}
                    <Divider my={2} />
                  </Box>
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        isOpen={isReproveModalOpen}
        onClose={onReproveModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Reprovar Atividade: {currentSubmission?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Justificativa da Reprovação</FormLabel>
              <Textarea
                value={reprovalReason}
                onChange={(e) => setReprovalReason(e.target.value)}
                placeholder="Descreva o motivo da reprovação aqui..."
                rows={4}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReproveModalClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={submitReproval}>
              Confirmar Reprovação
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReportsCompany;
