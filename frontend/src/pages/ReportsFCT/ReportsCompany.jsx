import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  IconButton,
  Input,
  Popover,
  Portal,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Icon,
  Checkbox,
} from "@chakra-ui/react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTimesCircle,
  FaCalendar,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getActivities,
  updateActivityStatus,
} from "../../services/activitiesService";
import ReportsSchool from "./ReportsSchool";

const ReportsCompany = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivitiesByStudent, setSelectedActivitiesByStudent] =
    useState({});
  const {
    isOpen: isReproveModalOpen,
    onOpen: onReproveModalOpen,
    onClose: onReproveModalClose,
  } = useDisclosure();
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [reprovalReason, setReprovalReason] = useState("");
  const toast = useToast();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const fetchCompanyActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (
        selectedDate &&
        Array.isArray(selectedDate) &&
        selectedDate.length === 2
      ) {
        params.startDate = `${selectedDate[0].getFullYear()}-${String(
          selectedDate[0].getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate[0].getDate()).padStart(
          2,
          "0"
        )}`;
        params.endDate = `${selectedDate[1].getFullYear()}-${String(
          selectedDate[1].getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate[1].getDate()).padStart(
          2,
          "0"
        )}`;
      }
      const response = await getActivities(params);
      setActivities(response.data.data || []);
    } catch (error) {
      toast({
        title: "Erro ao buscar atividades",
        description:
          error.response?.data?.message ||
          "Não foi possível carregar os dados.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, selectedDate]);

  useEffect(() => {
    fetchCompanyActivities();
  }, [fetchCompanyActivities, selectedDate]);

  const handleToggleActivitySelection = useCallback(
    (studentKey, activityId) => {
      setSelectedActivitiesByStudent((prev) => {
        const newSelected = new Set(prev[studentKey] || []);
        if (newSelected.has(activityId)) {
          newSelected.delete(activityId);
        } else {
          newSelected.add(activityId);
        }
        return { ...prev, [studentKey]: newSelected };
      });
    },
    []
  );

  const handleToggleSelectAllForStudent = useCallback(
    (studentKey, activitiesForStudent, isChecked) => {
      setSelectedActivitiesByStudent((prev) => {
        const newSelected = new Set();
        if (isChecked) {
          activitiesForStudent.forEach((activity) =>
            newSelected.add(activity.id)
          );
        }
        return { ...prev, [studentKey]: newSelected };
      });
    },
    []
  );

  const handleApprove = async (submissionId) => {
    setLoading(true);
    const payload = { approved: true };
    try {
      await updateActivityStatus(submissionId, payload);
      toast({
        title: "Atividade Aprovada!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchCompanyActivities();
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openReproveModal = (submission) => {
    setCurrentSubmission(submission);
    setReprovalReason("");
    onReproveModalOpen();
  };

  const handleBulkApprove = async (studentKey) => {
    const activitiesToApprove = Array.from(
      selectedActivitiesByStudent[studentKey] || []
    );
    if (activitiesToApprove.length === 0) {
      toast({
        title: "Nenhuma atividade selecionada",
        description: "Por favor, selecione as atividades para aprovar.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const activityId of activitiesToApprove) {
      try {
        await updateActivityStatus(activityId, { approved: true });
        successCount++;
      } catch (error) {
        console.error(`Erro ao aprovar atividade ${activityId}:`, error);
        errorCount++;
      }
    }

    setLoading(false);
    if (successCount > 0) {
      toast({
        title: `${successCount} atividade(s) aprovada(s)!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    if (errorCount > 0) {
      toast({
        title: `${errorCount} atividade(s) com erro ao aprovar.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setSelectedActivitiesByStudent((prev) => {
      const newSelected = { ...prev };
      delete newSelected[studentKey];
      return newSelected;
    });
    fetchCompanyActivities();
  };

  const openBulkReproveModal = (studentKey) => {
    const activitiesToReprove = Array.from(
      selectedActivitiesByStudent[studentKey] || []
    );
    if (activitiesToReprove.length === 0) {
      toast({
        title: "Nenhuma atividade selecionada",
        description: "Por favor, selecione as atividades para reprovar.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCurrentSubmission({
      isBulk: true,
      studentKey: studentKey,
      ids: activitiesToReprove,
    });
    setReprovalReason("");
    onReproveModalOpen();
  };

  const submitReproval = async () => {
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

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    const activitiesToProcess = currentSubmission.isBulk
      ? currentSubmission.ids
      : [currentSubmission.id];

    for (const activityId of activitiesToProcess) {
      try {
        await updateActivityStatus(activityId, {
          approved: false,
          justification: reprovalReason,
        });
        successCount++;
      } catch (error) {
        console.error(`Erro ao reprovar atividade ${activityId}:`, error);
        errorCount++;
      }
    }

    setLoading(false);
    if (successCount > 0) {
      toast({
        title: `${successCount} atividade(s) reprovada(s)!`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    if (errorCount > 0) {
      toast({
        title: `${errorCount} atividade(s) com erro ao reprovar.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    if (currentSubmission.isBulk) {
      setSelectedActivitiesByStudent((prev) => {
        const newSelected = { ...prev };
        delete newSelected[currentSubmission.studentKey];
        return newSelected;
      });
    }
    fetchCompanyActivities();
    onReproveModalClose();
  };

  const pendingSubmissionsGrouped = useMemo(() => {
    const pending = activities.filter((sub) => sub.status === "Pendente");
    return pending.reduce((acc, sub) => {
      const studentKey = sub.candidateName;
      if (!acc[studentKey]) {
        acc[studentKey] = {
          studentName: sub.candidateName,
          dates: {},
          allActivities: [],
        };
      }
      if (!acc[studentKey].dates[sub.activityDate]) {
        acc[studentKey].dates[sub.activityDate] = [];
      }
      acc[studentKey].dates[sub.activityDate].push(sub);
      acc[studentKey].allActivities.push(sub);
      return acc;
    }, {});
  }, [activities]);

  const formatDateKey = (date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).toDateString();

  const dailyData = useMemo(() => {
    return activities.reduce((acc, activity) => {
      const activityDate = new Date(`${activity.activityDate}T00:00:00`);
      const dateKey = formatDateKey(activityDate);
      acc[dateKey] = activity;
      return acc;
    }, {});
  }, [activities]);

  const historySubmissionsGrouped = useMemo(() => {
    const history = activities.filter(
      (sub) => sub.status === "Aprovado" || sub.status === "Reprovado"
    );
    return history.reduce((acc, sub) => {
      const studentKey = sub.candidateName;
      if (!acc[studentKey]) {
        acc[studentKey] = { studentName: sub.candidateName, dates: {} };
      }
      if (!acc[studentKey].dates[sub.activityDate]) {
        acc[studentKey].dates[sub.activityDate] = [];
      }
      acc[studentKey].dates[sub.activityDate].push(sub);
      acc[studentKey].dates[sub.activityDate].sort(
        (a, b) =>
          new Date(b.justificated_at || b.updated_at) -
          new Date(a.justificated_at || a.updated_at)
      );
      return acc;
    }, {});
  }, [activities]);

  const tileContent = useCallback(
    ({ date, view }) => {
      if (view === "month") {
        const activity = dailyData[formatDateKey(date)];
        if (activity) {
          const statusInfo = {
            icon:
              activity.status === "Aprovado" ? FaCheckCircle : FaTimesCircle,
            color: activity.status === "Aprovado" ? "green.500" : "red.500",
            label: activity.status,
          };
          return (
            <Icon
              as={statusInfo.icon}
              color={statusInfo.color}
              boxSize="0.9em"
              position="absolute"
              top="4px"
              right="4px"
              aria-label={statusInfo.label}
              title={statusInfo.label}
            />
          );
        }
      }
      return null;
    },
    [dailyData]
  );

  if (loading && activities.length === 0) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" color="purple.500" />
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
          <Tab>Relatórios Enviados</Tab>
        </TabList>

        <Box
          display={"flex"}
          position={"relative"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box display={"flex"} justifyContent={"center"} flexDirection={"row"}>
            <Popover autoFocus={false}>
              <PopoverTrigger>
                <Button
                  variant={"outline"}
                  color={"#5931E9"}
                  bg={"transparent"}
                  borderColor="linear(to-r, #7289FF, #5931E9)"
                  fontWeight="bold"
                  _hover={{
                    bgGradient: "linear(to-r, #7289FF, #5931E9)",
                    color: "white",
                  }}
                >
                  Selecionar periodo
                </Button>
              </PopoverTrigger>
              <PopoverContent
                boxShadow="none"
                outline="none"
                bg="transparent"
                borderColor="transparent"
              >
                <PopoverBody
                  boxShadow="none"
                  outline="none"
                  borderColor="transparent"
                >
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    selectRange={true}
                    tileContent={tileContent}
                    locale="pt-PT"
                    prevLabel={
                      <IconButton
                        aria-label="Mês anterior"
                        icon={<FaChevronLeft />}
                        size="sm"
                        variant="ghost"
                      />
                    }
                    nextLabel={
                      <IconButton
                        aria-label="Próximo mês"
                        icon={<FaChevronRight />}
                        size="sm"
                        variant="ghost"
                      />
                    }
                    prev2Label={
                      <IconButton
                        aria-label="Ano anterior"
                        icon={<FaAngleDoubleLeft />}
                        size="sm"
                        variant="ghost"
                      />
                    }
                    next2Label={
                      <IconButton
                        aria-label="Próximo ano"
                        icon={<FaAngleDoubleRight />}
                        size="sm"
                        variant="ghost"
                      />
                    }
                    navigationLabel={({ date, view }) => {
                      let currentLabel = date.toLocaleDateString("pt-PT", {
                        month: "long",
                        year: "numeric",
                      });
                      if (view === "year")
                        currentLabel = date.getFullYear().toString();
                      if (view === "decade") {
                        const startYear =
                          date.getFullYear() - (date.getFullYear() % 10);
                        currentLabel = `${startYear} - ${startYear + 9}`;
                      }
                      if (view === "century") {
                        const startYear =
                          date.getFullYear() - (date.getFullYear() % 100);
                        currentLabel = `${startYear} - ${startYear % 100}`;
                      }
                      return (
                        <Button
                          size="sm"
                          variant="ghost"
                          color="purple.700"
                          _hover={{ bg: "purple.50" }}
                          textTransform="capitalize"
                        >
                          {currentLabel}
                        </Button>
                      );
                    }}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Box>

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
                  ([studentKey, studentData]) => {
                    const allActivitiesForStudent = studentData.allActivities;
                    const selectedCount =
                      selectedActivitiesByStudent[studentKey]?.size || 0;
                    const isAllSelected =
                      selectedCount === allActivitiesForStudent.length &&
                      allActivitiesForStudent.length > 0;
                    const isIndeterminate =
                      selectedCount > 0 &&
                      selectedCount < allActivitiesForStudent.length;

                    return (
                      <AccordionItem
                        key={studentKey}
                        mb={4}
                        borderTopWidth="1px"
                        borderBottomWidth="1px"
                      >
                        <h2>
                          <AccordionButton
                            _expanded={{
                              bg: "purple.100",
                              color: "purple.700",
                            }}
                          >
                            <HStack flex="1" justifyContent="space-between">
                              <Checkbox
                                isChecked={isAllSelected}
                                isIndeterminate={isIndeterminate}
                                onChange={(e) =>
                                  handleToggleSelectAllForStudent(
                                    studentKey,
                                    allActivitiesForStudent,
                                    e.target.checked
                                  )
                                }
                                mr={2}
                              >
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold"
                                  fontSize="lg"
                                >
                                  {studentData.studentName}
                                </Box>
                              </Checkbox>
                              <AccordionIcon />
                            </HStack>
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
                                      <HStack
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                      >
                                        <Checkbox
                                          isChecked={
                                            selectedActivitiesByStudent[
                                              studentKey
                                            ]?.has(activity.id) || false
                                          }
                                          onChange={() =>
                                            handleToggleActivitySelection(
                                              studentKey,
                                              activity.id
                                            )
                                          }
                                          mr={2}
                                        >
                                          <Heading size="sm" mb={1}>
                                            {activity.title}
                                          </Heading>
                                        </Checkbox>
                                        <HStack spacing={3}>
                                          <Button
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            onClick={() =>
                                              openReproveModal(activity)
                                            }
                                            leftIcon={<FaTimesCircle />}
                                            isDisabled={
                                              loading ||
                                              selectedActivitiesByStudent[
                                                studentKey
                                              ]?.has(activity.id) ||
                                              false
                                            }
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
                                            isDisabled={
                                              loading ||
                                              selectedActivitiesByStudent[
                                                studentKey
                                              ]?.has(activity.id) ||
                                              false
                                            }
                                          >
                                            Aprovar
                                          </Button>
                                        </HStack>
                                      </HStack>
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        noOfLines={2}
                                        mb={1}
                                      >
                                        Descrição:{" "}
                                        {activity.description || "N/A"}
                                      </Text>
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        mb={2}
                                      >
                                        Horas: {activity.estimatedTime}
                                      </Text>
                                    </Box>
                                  ))}
                                </VStack>
                              </Box>
                            ))}
                          <HStack mt={4} justifyContent="flex-end" spacing={3}>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => openBulkReproveModal(studentKey)}
                              isDisabled={
                                !selectedActivitiesByStudent[studentKey]
                                  ?.size || loading
                              }
                              leftIcon={<FaTimesCircle />}
                            >
                              Reprovar Selecionados
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleBulkApprove(studentKey)}
                              isDisabled={
                                !selectedActivitiesByStudent[studentKey]
                                  ?.size || loading
                              }
                              leftIcon={<FaCheckCircle />}
                            >
                              Aprovar Selecionados
                            </Button>
                          </HStack>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
              </Accordion>
            )}
          </TabPanel>
          <TabPanel>
            {Object.keys(historySubmissionsGrouped).length === 0 ? (
              <Text textAlign="center" p={5}>
                Nenhuma decisão no histórico ainda.
              </Text>
            ) : (
              <Accordion
                allowMultiple
                defaultIndex={Object.keys(historySubmissionsGrouped).map(
                  (_, i) => i
                )}
              >
                {Object.entries(historySubmissionsGrouped).map(
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
                              new Date(dateB) - new Date(dateA)
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
                                {activities.map((sub) => (
                                  <Box
                                    key={sub.id}
                                    p={4}
                                    shadow="md"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    bg={
                                      sub.status === "Aprovado"
                                        ? "green.50"
                                        : "red.50"
                                    }
                                    borderColor={
                                      sub.status === "Aprovado"
                                        ? "green.200"
                                        : "red.200"
                                    }
                                  >
                                    <HStack
                                      justifyContent="space-between"
                                      mb={2}
                                    >
                                      <Heading size="sm">{sub.title}</Heading>
                                      <Badge
                                        colorScheme={
                                          sub.status === "Aprovado"
                                            ? "green"
                                            : "red"
                                        }
                                        fontSize="sm"
                                      >
                                        {sub.status}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="sm">
                                      <strong>Candidato:</strong>{" "}
                                      {sub.candidateName}
                                    </Text>
                                    <Text fontSize="sm">
                                      <strong>Data da Atividade:</strong>{" "}
                                      {new Date(
                                        sub.activityDate + "T00:00:00"
                                      ).toLocaleDateString("pt-BR")}
                                    </Text>
                                    <Text fontSize="sm">
                                      <strong>Horas:</strong>{" "}
                                      {sub.estimatedTime}
                                    </Text>
                                    {sub.description && (
                                      <Text fontSize="sm" noOfLines={2}>
                                        <strong>Descrição:</strong>{" "}
                                        {sub.description}
                                      </Text>
                                    )}
                                    {sub.status === "Reprovado" &&
                                      sub.justification && (
                                        <Text
                                          fontSize="sm"
                                          color="red.700"
                                          mt={1}
                                        >
                                          <strong>Justificativa:</strong>{" "}
                                          {sub.justification}
                                        </Text>
                                      )}
                                    <Divider my={2} />
                                    <Text fontSize="xs" color="gray.500">
                                      Decidido em:{" "}
                                      {sub.justificated_at
                                        ? new Date(
                                            sub.justificated_at
                                          ).toLocaleString("pt-BR")
                                        : "N/A"}
                                    </Text>
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
            <ReportsSchool />
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
            Reprovar Atividade
            {currentSubmission?.isBulk
              ? "s selecionadas"
              : `: ${currentSubmission?.title}`}
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
            <Button
              colorScheme="red"
              onClick={submitReproval}
              isLoading={loading}
            >
              Confirmar Reprovação
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReportsCompany;
