import React, { useState, useMemo, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../app.css";
import {
  FaStickyNote,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTrash,
  FaEdit,
  FaPaperPlane,
  FaEye,
} from "react-icons/fa";
import {
  Box,
  Flex,
  Heading,
  Textarea,
  Button,
  Text,
  Icon,
  useToast,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  IconButton,
  Input,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Spinner,
  Switch,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { useActivities } from "../../hooks/useActivities";

const formatDateKey = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();

const formatDateForApi = (date) => date.toISOString().split("T")[0];

const ReportsCandidate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterSelectedDate, setFilterSelectedDate] = useState(null);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [currentHours, setCurrentHours] = useState("");

  const toast = useToast();
  const {
    activities,
    activeContract,
    loading,
    totalHours,
    workedHours,
    errorMessage,
    successMessage,
    fetchActivities,
    createNewActivity,
    updateActivity,
    deleteActivity,
    clearMessages,
  } = useActivities();

  useEffect(() => {
    const params = {};
    if (
      filterSelectedDate &&
      Array.isArray(filterSelectedDate) &&
      filterSelectedDate.length === 2
    ) {
      params.startDate = `${filterSelectedDate[0].getFullYear()}-${String(
        filterSelectedDate[0].getMonth() + 1
      ).padStart(2, "0")}-${String(filterSelectedDate[0].getDate()).padStart(
        2,
        "0"
      )}`;
      params.endDate = `${filterSelectedDate[1].getFullYear()}-${String(
        filterSelectedDate[1].getMonth() + 1
      ).padStart(2, "0")}-${String(filterSelectedDate[1].getDate()).padStart(
        2,
        "0"
      )}`;
    }
    fetchActivities(params);
  }, [fetchActivities, filterSelectedDate]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Ocorreu um erro",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      clearMessages();
    }
  }, [errorMessage, toast, clearMessages]);

  const dailyData = useMemo(() => {
    return activities.reduce((acc, activity) => {
      const [year, month, day] = activity.activityDate.split("-").map(Number);
      const activityDate = new Date(year, month - 1, day);

      const dateKey = formatDateKey(activityDate);
      acc[dateKey] = activity;
      return acc;
    }, {});
  }, [activities]);

  const activityForSelectedDate = useMemo(() => {
    const firstDate = Array.isArray(selectedDate)
      ? selectedDate[0]
      : selectedDate;
    return dailyData[formatDateKey(firstDate)];
  }, [selectedDate, dailyData]);

  const remainingHours = totalHours - workedHours;
  const allHoursUsed = remainingHours <= 0;

  const saveOrSubmitEntry = async (isDraft) => {
    let startDate, endDate;
    if (Array.isArray(selectedDate)) {
      [startDate, endDate] = selectedDate;
    } else {
      startDate = endDate = selectedDate;
    }

    const hoursToSave = parseFloat(currentHours.replace(",", ".")) || 0;

    if (!isDraft && hoursToSave <= 0) {
      toast({
        title: "Horas Inválidas",
        description:
          "Não é possível submeter uma atividade com 0 ou menos horas. Salve como rascunho se desejar.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!currentTitle && !currentNote && hoursToSave === 0) {
      toast({
        title: "Entrada Vazia",
        description: "Preencha ao menos um campo para salvar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const promises = [];
    const datesProcessed = [];
    const datesExceedingLimit = [];
    const datesBlockedBecauseSubmitted = [];
    let currentWorkedHoursSum = workedHours;

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = formatDateKey(currentDate);
      const existingActivity = dailyData[dateKey];
      const canEdit =
        !existingActivity || existingActivity.status === "Rascunho";

      if (!canEdit) {
        datesBlockedBecauseSubmitted.push(
          currentDate.toLocaleDateString("pt-PT")
        );
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      let hoursForThisDate = hoursToSave;

      let hoursToSubtractFromWorked = 0;
      if (existingActivity) {
        hoursToSubtractFromWorked = existingActivity.estimatedTime || 0;
      }
      const potentialNewWorkedHours =
        currentWorkedHoursSum - hoursToSubtractFromWorked + hoursForThisDate;

      if (!isDraft && potentialNewWorkedHours > totalHours) {
        datesExceedingLimit.push(currentDate.toLocaleDateString("pt-PT"));
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      } else {
        currentWorkedHoursSum = potentialNewWorkedHours;
      }

      const payload = {
        title: currentTitle,
        description: currentNote,
        estimatedTime: hoursForThisDate,
        activityDate: formatDateForApi(currentDate),
        draft: isDraft,
      };

      if (existingActivity) {
        promises.push(updateActivity(existingActivity.id, payload));
      } else {
        promises.push(createNewActivity(payload));
      }
      datesProcessed.push(new Date(currentDate));

      currentDate.setDate(currentDate.getDate() + 1);
    }

    try {
      await Promise.all(promises);
      if (promises.length > 0) {
        const actionType = isDraft ? "salvas" : "submetidas";
        let successDescription = "";

        if (datesProcessed.length === 1) {
          successDescription = `Atividade para ${datesProcessed[0].toLocaleDateString(
            "pt-PT"
          )} ${actionType} com sucesso!`;
        } else if (datesProcessed.length > 1) {
          successDescription = `Atividades para o período selecionado (${datesProcessed.length} registros) ${actionType} com sucesso!`;
        } else if (
          datesProcessed.length === 0 &&
          (datesExceedingLimit.length > 0 ||
            datesBlockedBecauseSubmitted.length > 0)
        ) {
        } else {
          toast({
            title: "Nenhuma atividade foi alterada",
            description:
              "Nenhum registro foi modificado ou criado dentro do período selecionado.",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
        }

        if (successDescription) {
          toast({
            title: "Sucesso!",
            description: successDescription,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          const params = {};
          if (
            filterSelectedDate &&
            Array.isArray(filterSelectedDate) &&
            filterSelectedDate.length === 2
          ) {
            params.startDate = `${filterSelectedDate[0].getFullYear()}-${String(
              filterSelectedDate[0].getMonth() + 1
            ).padStart(2, "0")}-${String(
              filterSelectedDate[0].getDate()
            ).padStart(2, "0")}`;
            params.endDate = `${filterSelectedDate[1].getFullYear()}-${String(
              filterSelectedDate[1].getMonth() + 1
            ).padStart(2, "0")}-${String(
              filterSelectedDate[1].getDate()
            ).padStart(2, "0")}`;
          }
          fetchActivities(params);
        }
      }

      if (datesExceedingLimit.length > 0) {
        toast({
          title: "Limite de Horas Atingido",
          description: `Não foi possível registrar atividades para ${datesExceedingLimit.join(
            ", "
          )} pois o limite total de horas do protocolo seria excedido.`,
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }

      if (datesBlockedBecauseSubmitted.length > 0) {
        toast({
          title: "Atenção: Atividades Já Submetidas",
          description: `As atividades para ${datesBlockedBecauseSubmitted.join(
            ", "
          )} não foram alteradas pois já foram submetidas para validação ou aprovadas.`,
          status: "info",
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar/submeter atividades:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar as atividades.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSelectedDate(endDate);
      setIsRangeMode(false);
      setCurrentTitle("");
      setCurrentNote("");
      setCurrentHours("");
    }
  };

  useEffect(() => {
    if (activityForSelectedDate) {
      setCurrentTitle(activityForSelectedDate.title || "");
      setCurrentNote(activityForSelectedDate.description || "");
      setCurrentHours(activityForSelectedDate.estimatedTime?.toString() || "");
    } else {
      setCurrentTitle("");
      setCurrentNote("");
      setCurrentHours("");
    }
  }, [activityForSelectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleFilterDateChange = (newDate) => {
    setFilterSelectedDate(newDate);
  };

  const handleRangeModeToggle = (event) => {
    const isChecked = event.target.checked;
    setIsRangeMode(isChecked);

    if (!isChecked && Array.isArray(selectedDate)) {
      setSelectedDate(selectedDate[0]);
    }
  };

  const handleSaveAsDraft = () => {
    saveOrSubmitEntry(false);
  };

  const handleSubmitForValidation = () => {
    saveOrSubmitEntry(true);
  };

  const handleDeleteActivity = async (activityId, activityStatus) => {
    if (activityStatus === "Rascunho") {
      try {
        await deleteActivity(activityId);
        if (activityForSelectedDate?.id === activityId) {
          setCurrentTitle("");
          setCurrentNote("");
          setCurrentHours("");
        }
        toast({
          title: "Rascunho excluído",
          description: "O rascunho foi excluído com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Erro ao excluir rascunho:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o rascunho.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Ação não permitida",
        description: "Apenas rascunhos podem ser excluídos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditDraft = (activity) => {
    const [year, month, day] = activity.activityDate.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    setSelectedDate(localDate);
    setIsRangeMode(false);
    setCurrentTitle(activity.title || "");
    setCurrentNote(activity.description || "");
    setCurrentHours(activity.estimatedTime?.toString() || "");
  };

  const getDisplayStatusInfo = useCallback((statusString) => {
    switch (statusString) {
      case "Rascunho":
        return {
          text: "Rascunho",
          color: "blue.600",
          icon: FaEdit,
          label: "Rascunho",
        };
      case "Pendente":
        return {
          text: "Pendente",
          color: "orange.600",
          icon: FaPaperPlane,
          label: "Pendente",
        };
      case "Aprovado":
        return {
          text: "Aprovado",
          color: "green.600",
          icon: FaStickyNote,
          label: "Aprovado",
        };
      case "Reprovado":
        return {
          text: "Reprovado",
          color: "red.600",
          icon: FaStickyNote,
          label: "Reprovado",
        };
      default:
        return {
          text: "N/D",
          color: "gray.600",
          icon: FaStickyNote,
          label: "Sem dados",
        };
    }
  }, []);

  const tileContent = useCallback(
    ({ date, view }) => {
      if (view === "month") {
        const activity = dailyData[formatDateKey(date)];
        if (activity) {
          const statusInfo = getDisplayStatusInfo(activity.status);
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
    [dailyData, getDisplayStatusInfo]
  );

  const summaryEntries = useMemo(() => {
    return activities
      .map((activity) => {
        const statusInfo = getDisplayStatusInfo(activity.status);
        const [year, month, day] = activity.activityDate.split("-").map(Number);
        const activityDate = new Date(year, month - 1, day);
        return {
          ...activity,
          date: activityDate,
          displayDate: activityDate.toLocaleDateString("pt-PT"),
          displayStatus: statusInfo.text,
          statusColor: statusInfo.color,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [activities, getDisplayStatusInfo]);

  const displaySelectedDate = () => {
    if (Array.isArray(selectedDate)) {
      const startDate = selectedDate[0].toLocaleDateString("pt-PT");
      const endDate = selectedDate[1]?.toLocaleDateString("pt-PT") || startDate;
      return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
    }
    return selectedDate.toLocaleDateString("pt-PT");
  };

  const isFormDisabled = useMemo(() => {
    if (loading) return true;
    if (activityForSelectedDate) {
      return activityForSelectedDate.status !== "Rascunho";
    }
    return false;
  }, [loading, activityForSelectedDate]);

  if (loading && !activities.length) {
    return (
      <Center h="80vh">
        {" "}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />{" "}
      </Center>
    );
  }

  if (!activeContract) {
    return (
      <Center h="80vh">
        {" "}
        <Box textAlign="center" p={5}>
          {" "}
          <Heading as="h2" size="lg" mb={4}>
            Atenção{" "}
          </Heading>{" "}
          <Text fontSize="xl">Você não possui nenhum protocolo ativo.</Text>{" "}
        </Box>{" "}
      </Center>
    );
  }

  return (
    <Box p={5}>
      {loading && activities.length > 0 && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
          position="fixed"
          top="50%"
          left="50%"
          zIndex="popover"
        />
      )}
      <Heading mb={6} textAlign="center">
        Registo de Atividades
      </Heading>
      <Flex
        direction={{ base: "column", md: "row" }}
        p={{ base: 3, md: 5 }}
        gap={6}
        align="flex-start"
      >
        <Box
          flex={{ base: "1 1 100%", md: "1 1 auto" }}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
        >
          <Heading size="lg" mb={4} textAlign="center">
            Calendário
          </Heading>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={4}
          >
            <FormLabel htmlFor="range-switch" mb="0" mr={2}>
              Selecionar intervalo
            </FormLabel>
            <Switch
              id="range-switch"
              colorScheme="purple"
              isChecked={isRangeMode}
              onChange={handleRangeModeToggle}
            />
          </FormControl>
          <Box
            display="flex"
            justifyContent="center"
            className="calendar-container"
          >
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              selectRange={isRangeMode}
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
          </Box>
          <Text mt={4} fontSize="md">
            Data(s) selecionada(s):{" "}
            <Text as="span" fontWeight="bold">
              {displaySelectedDate()}
            </Text>
          </Text>
          {summaryEntries.length > 0 && (
            <Box
              mt={8}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="gray.200"
              boxShadow="sm"
              overflowX="auto"
            >
              <Box textAlign="center" mt={4} mb={2}>
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
                      width="350px"
                    >
                      <Calendar
                        onChange={handleFilterDateChange}
                        value={filterSelectedDate}
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
              <Heading size="md" textAlign="center" mt={4} mb={2}>
                Resumo de Atividades
              </Heading>
              <TableContainer>
                <Table variant="striped" colorScheme="purple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Data</Th>
                      <Th>Título</Th>
                      <Th isNumeric>Horas</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {summaryEntries.map((entry) => (
                      <Tr key={entry.id}>
                        <Td>{entry.displayDate}</Td>
                        <Td
                          whiteSpace="normal"
                          wordBreak="break-word"
                          maxW="180px"
                          title={entry.title}
                        >
                          {entry.title || "(Sem título)"}
                        </Td>
                        <Td isNumeric>
                          {(entry.estimatedTime || 0).toLocaleString("pt-PT")}
                        </Td>
                        <Td>
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={entry.statusColor}
                          >
                            {entry.displayStatus}
                          </Text>
                        </Td>
                        <Td>
                          {entry.status !== "Rascunho" && (
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Ver atividade"
                                icon={<FaEye />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditDraft(entry)}
                                title="Ver atividade"
                              />
                            </HStack>
                          )}
                          {entry.status === "Rascunho" && (
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Editar rascunho"
                                icon={<FaEdit />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditDraft(entry)}
                                title="Editar Rascunho"
                              />
                              <IconButton
                                aria-label="Apagar rascunho"
                                icon={<FaTrash />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() =>
                                  handleDeleteActivity(entry.id, entry.status)
                                }
                                title="Apagar Rascunho"
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>

        <Box
          flex={{ base: "1 1 100%", md: "1 1 50%" }}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          mt={{ base: 6, md: 0 }}
        >
          <Heading size="lg" mb={6}>
            Registrar para {displaySelectedDate()}
          </Heading>
          <VStack spacing={5} align="stretch">
            <FormControl isDisabled={isFormDisabled}>
              <FormLabel htmlFor="titulo" fontWeight="semibold">
                Título
              </FormLabel>
              <Input
                id="titulo"
                placeholder="Título da atividade/registro"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                focusBorderColor="purple.500"
              />
            </FormControl>
            <FormControl isDisabled={isFormDisabled}>
              <FormLabel htmlFor="anotacao" fontWeight="semibold">
                Anotação/Descrição
              </FormLabel>
              <Textarea
                id="anotacao"
                placeholder="Detalhes, tarefas realizadas, etc."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                minHeight="100px"
                focusBorderColor="purple.500"
              />
            </FormControl>
            <FormControl isDisabled={isFormDisabled}>
              <FormLabel htmlFor="horas" fontWeight="semibold">
                Horas Trabalhadas no Dia
              </FormLabel>
              <NumberInput
                id="horas"
                value={currentHours}
                onChange={(value) => setCurrentHours(value)}
                min={0}
                max={24}
                step={0.5}
                precision={1}
                focusBorderColor="purple.500"
              >
                <NumberInputField placeholder="Ex: 8 ou 4" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {(() => {
              if (allHoursUsed && !activityForSelectedDate && !isRangeMode) {
                return (
                  <Box
                    textAlign="center"
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    mt={4}
                    borderColor="red.300"
                    bg="red.50"
                  >
                    <Text color="red.600" fontWeight="bold">
                      As horas do protocolo foram finalizadas. Não é possível
                      criar novos registros.
                    </Text>
                  </Box>
                );
              }
              if (isFormDisabled && !Array.isArray(selectedDate)) {
                return (
                  <Box
                    textAlign="center"
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    mt={4}
                    borderColor={
                      getDisplayStatusInfo(
                        activityForSelectedDate?.status
                      ).color.split(".")[0] + ".300"
                    }
                    bg={`${
                      getDisplayStatusInfo(
                        activityForSelectedDate?.status
                      ).color.split(".")[0]
                    }.50`}
                  >
                    <Text
                      color={
                        getDisplayStatusInfo(activityForSelectedDate?.status)
                          .color
                      }
                      fontWeight="bold"
                    >
                      Este registo está com status "
                      {activityForSelectedDate?.status}" e não pode ser
                      alterado.
                    </Text>
                  </Box>
                );
              }
              return (
                <>
                  <HStack spacing={4} mt={4} width="full">
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={handleSaveAsDraft}
                      flex={1}
                      size="lg"
                      isDisabled={loading}
                    >
                      Salvar como Rascunho
                    </Button>
                    <Button
                      colorScheme="purple"
                      onClick={handleSubmitForValidation}
                      flex={1}
                      size="lg"
                      isDisabled={loading}
                    >
                      Submeter para Validação
                    </Button>
                  </HStack>
                  {activityForSelectedDate &&
                    activityForSelectedDate.status === "Rascunho" &&
                    !Array.isArray(selectedDate) && (
                      <Button
                        colorScheme="red"
                        variant="ghost"
                        onClick={() =>
                          handleDeleteActivity(
                            activityForSelectedDate.id,
                            activityForSelectedDate.status
                          )
                        }
                        mt={3}
                        width="full"
                        leftIcon={<Icon as={FaTrash} />}
                        size="md"
                        isDisabled={loading}
                      >
                        Excluir Rascunho
                      </Button>
                    )}
                </>
              );
            })()}
          </VStack>
          <Divider my={8} />
          <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <Heading size="md" mb={4} textAlign="center">
              Resumo Geral de Horas
            </Heading>
            <StatGroup justifyContent="space-around">
              <Stat>
                <StatLabel textAlign="center">Horas Totais</StatLabel>
                <StatNumber textAlign="center">
                  {totalHours.toLocaleString("pt-PT")}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel textAlign="center">Horas Trabalhadas</StatLabel>
                <StatNumber
                  textAlign="center"
                  color={workedHours > totalHours ? "orange.500" : "green.500"}
                >
                  {workedHours.toLocaleString("pt-PT")}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel textAlign="center">Horas Restantes</StatLabel>
                <StatNumber
                  textAlign="center"
                  color={remainingHours < 0 ? "red.500" : "inherit"}
                >
                  {remainingHours.toLocaleString("pt-PT")}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ReportsCandidate;
