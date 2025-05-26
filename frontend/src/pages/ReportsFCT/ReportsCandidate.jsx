import React, { useState, useMemo } from "react";
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
} from "@chakra-ui/react";

const formatDateKey = (date) => date.toDateString();

const ReportsCandidate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [currentHours, setCurrentHours] = useState("");
  const [currentEntryStatus, setCurrentEntryStatus] = useState(null);
  const toast = useToast();

  const totalProjectHours = 600;

  const workedHours = useMemo(() => {
    return Object.values(dailyData).reduce((sum, data) => {
      if (data && typeof data.hours === "number" && !isNaN(data.hours)) {
        return sum + data.hours;
      }
      return sum;
    }, 0);
  }, [dailyData]);

  const remainingHours = totalProjectHours - workedHours;

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const dateKey = formatDateKey(newDate);
    const dataForDate = dailyData[dateKey];
    setCurrentTitle(dataForDate?.title || "");
    setCurrentNote(dataForDate?.note || "");
    setCurrentHours(dataForDate?.hours?.toString() || "");
    setCurrentEntryStatus(dataForDate?.status || null);
  };

  const handleTitleInputChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  const handleNoteInputChange = (e) => {
    setCurrentNote(e.target.value);
  };

  const handleHoursInputChange = (valueAsString) => {
    setCurrentHours(valueAsString);
  };

  const saveEntryWithStatus = (statusToSet) => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const hoursToSave = parseFloat(currentHours.replace(",", "."));

      if (currentHours !== "" && isNaN(hoursToSave)) {
        if (!(currentHours === "" && statusToSet === "draft")) {
          toast({
            title: "Entrada Inválida",
            description:
              "Por favor, insira um número válido para as horas ou deixe o campo vazio para rascunhos.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      setDailyData((prevData) => ({
        ...prevData,
        [dateKey]: {
          title: currentTitle,
          note: currentNote,
          hours: currentHours === "" ? undefined : hoursToSave,
          status: statusToSet,
        },
      }));

      setCurrentEntryStatus(statusToSet);

      let toastTitle = "Dados Salvos!";
      if (statusToSet === "draft") toastTitle = "Salvo como Rascunho!";
      if (statusToSet === "pending_approval")
        toastTitle = "Submetido para Validação!";

      toast({
        title: toastTitle,
        description: `Informações para ${selectedDate.toLocaleDateString(
          "pt-BR"
        )} foram processadas.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveAsDraft = () => {
    saveEntryWithStatus("draft");
  };

  const handleSubmitForValidation = () => {
    if (
      !currentTitle &&
      !currentNote &&
      (currentHours === "" || parseFloat(currentHours.replace(",", ".")) === 0)
    ) {
      toast({
        title: "Entrada Vazia",
        description: "Preencha ao menos um campo para submeter.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    saveEntryWithStatus("pending_approval");
  };

  const handleDeleteDraft = () => {
    if (
      selectedDate &&
      dailyData[formatDateKey(selectedDate)]?.status === "draft"
    ) {
      const dateKey = formatDateKey(selectedDate);
      const { [dateKey]: _, ...remainingData } = dailyData;
      setDailyData(remainingData);

      setCurrentTitle("");
      setCurrentNote("");
      setCurrentHours("");
      setCurrentEntryStatus(null);

      toast({
        title: "Rascunho excluído!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = formatDateKey(date);
      const data = dailyData[dateKey];

      let iconToShow = FaStickyNote;
      let iconColor = "purple.500";
      let iconAriaLabel = "Dados registrados";

      if (data?.status === "draft") {
        iconToShow = FaEdit;
        iconColor = "blue.500";
        iconAriaLabel = "Rascunho salvo";
      } else if (data?.status === "pending_approval") {
        iconToShow = FaPaperPlane;
        iconColor = "orange.500";
        iconAriaLabel = "Pendente de Aprovação";
      } else if (data?.status === "approved") {
        iconToShow = FaStickyNote;
        iconColor = "green.500";
        iconAriaLabel = "Aprovado";
      }

      if (
        data &&
        ((data.title && data.title.trim() !== "") ||
          (data.note && data.note.trim() !== "") ||
          data.hours !== undefined)
      ) {
        return (
          <Icon
            as={iconToShow}
            color={iconColor}
            boxSize="0.9em"
            position="absolute"
            top="4px"
            right="4px"
            aria-label={iconAriaLabel}
            title={iconAriaLabel}
          />
        );
      }
    }
    return null;
  };

  const dataForSelectedDate = dailyData[formatDateKey(selectedDate)];

  const getDisplayStatus = (status) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "pending_approval":
        return "Pendente";
      case "approved":
        return "Aprovado";
      default:
        return "N/D";
    }
  };

  const summaryEntries = useMemo(() => {
    return Object.entries(dailyData)
      .filter(
        ([dateKey, data]) =>
          data &&
          ((data.title && data.title.trim() !== "") || data.hours !== undefined)
      )
      .map(([dateKey, data]) => ({
        dateKey,
        date: new Date(dateKey),
        displayDate: new Date(dateKey).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        title:
          data.title && data.title.trim() !== "" ? data.title : "(Sem título)",
        hours:
          typeof data.hours === "number" && !isNaN(data.hours) ? data.hours : 0,
        status: data.status,
        displayStatus: getDisplayStatus(data.status),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [dailyData]);

  const isFormDisabled = currentEntryStatus === "pending_approval";

  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        Registo de Atividadees
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
          <Box
            display="flex"
            justifyContent="center"
            className="calendar-container"
          >
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              locale="pt-BR"
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
                let currentLabel = date.toLocaleDateString("pt-BR", {
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
                  currentLabel = `${startYear} - ${startYear + 99}`;
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
            Data selecionada:{" "}
            <Text as="span" fontWeight="bold">
              {selectedDate.toLocaleDateString("pt-BR")}
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
                    </Tr>
                  </Thead>
                  <Tbody>
                    {summaryEntries.map((entry) => (
                      <Tr key={entry.dateKey}>
                        <Td>{entry.displayDate}</Td>
                        <Td
                          whiteSpace="normal"
                          wordBreak="break-word"
                          maxW="180px"
                          title={entry.title}
                        >
                          {entry.title}
                        </Td>
                        <Td isNumeric>{entry.hours.toLocaleString("pt-BR")}</Td>
                        <Td>
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={
                              entry.status === "pending_approval"
                                ? "orange.600"
                                : entry.status === "approved"
                                ? "green.600"
                                : entry.status === "draft"
                                ? "blue.600"
                                : "gray.600"
                            }
                          >
                            {entry.displayStatus}
                          </Text>
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
            Registar para {selectedDate.toLocaleDateString("pt-BR")}
          </Heading>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={isFormDisabled && !!currentTitle}>
              <FormLabel htmlFor="titulo" fontWeight="semibold">
                Título
              </FormLabel>
              <Input
                id="titulo"
                placeholder="Título da atividade/registo"
                value={currentTitle}
                onChange={handleTitleInputChange}
                focusBorderColor="purple.500"
                autoComplete="off"
                isDisabled={isFormDisabled}
              />
            </FormControl>
            <FormControl isInvalid={isFormDisabled && !!currentNote}>
              <FormLabel htmlFor="anotacao" fontWeight="semibold">
                Anotação
              </FormLabel>
              <Textarea
                id="anotacao"
                placeholder="Detalhes, tarefas realizadas, etc."
                value={currentNote}
                onChange={handleNoteInputChange}
                size="md"
                minHeight="100px"
                focusBorderColor="purple.500"
                isDisabled={isFormDisabled}
              />
            </FormControl>
            <FormControl isInvalid={isFormDisabled && !!currentHours}>
              <FormLabel htmlFor="horas" fontWeight="semibold">
                Horas Trabalhadas no Dia
              </FormLabel>
              <NumberInput
                id="horas"
                value={currentHours}
                onChange={handleHoursInputChange}
                min={0}
                max={24}
                step={0.5}
                precision={1}
                focusBorderColor="purple.500"
                isDisabled={isFormDisabled}
              >
                <NumberInputField
                  placeholder="Ex: 8 ou 4,5"
                  isDisabled={isFormDisabled}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper isDisabled={isFormDisabled} />
                  <NumberDecrementStepper isDisabled={isFormDisabled} />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {isFormDisabled ? (
              <Box
                textAlign="center"
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderColor="orange.300"
                bg="orange.50"
                mt={4}
              >
                <Text color="orange.600" fontWeight="bold">
                  Este registo está Pendente de Aprovação e não pode ser
                  alterado ou excluído.
                </Text>
              </Box>
            ) : (
              <>
                <HStack spacing={4} mt={4} width="full">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    flex={1}
                    size="lg"
                  >
                    Salvar como Rascunho
                  </Button>
                  <Button
                    colorScheme="purple"
                    onClick={handleSubmitForValidation}
                    flex={1}
                    size="lg"
                  >
                    Submeter para Validação
                  </Button>
                </HStack>
                {currentEntryStatus === "draft" && dataForSelectedDate && (
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    onClick={handleDeleteDraft}
                    mt={3}
                    width="full"
                    leftIcon={<Icon as={FaTrash} />}
                    size="md"
                  >
                    Excluir Rascunho
                  </Button>
                )}
              </>
            )}
          </VStack>

          {dataForSelectedDate &&
            (dataForSelectedDate.title ||
              dataForSelectedDate.note ||
              dataForSelectedDate.hours !== undefined) && (
              <Box
                mt={8}
                p={4}
                bg={
                  dataForSelectedDate.status === "pending_approval"
                    ? "orange.50"
                    : dataForSelectedDate.status === "draft"
                    ? "blue.50"
                    : dataForSelectedDate.status === "approved"
                    ? "green.50"
                    : "gray.50"
                }
                borderRadius="md"
                borderWidth="1px"
                borderColor={
                  dataForSelectedDate.status === "pending_approval"
                    ? "orange.200"
                    : dataForSelectedDate.status === "draft"
                    ? "blue.200"
                    : dataForSelectedDate.status === "approved"
                    ? "green.200"
                    : "gray.200"
                }
              >
                <Heading
                  size="md"
                  color={
                    dataForSelectedDate.status === "pending_approval"
                      ? "orange.700"
                      : dataForSelectedDate.status === "draft"
                      ? "blue.700"
                      : dataForSelectedDate.status === "approved"
                      ? "green.700"
                      : "gray.700"
                  }
                  mb={3}
                >
                  Informações Salvas (
                  {getDisplayStatus(dataForSelectedDate.status)})
                </Heading>
                {dataForSelectedDate.title &&
                  dataForSelectedDate.title.trim() !== "" && (
                    <Box
                      mb={
                        dataForSelectedDate.note ||
                        dataForSelectedDate.hours !== undefined
                          ? 3
                          : 0
                      }
                    >
                      <Text fontWeight="bold">Título:</Text>
                      <Text
                        whiteSpace="normal"
                        wordBreak="break-word"
                        fontSize="sm"
                        color="gray.600"
                      >
                        {dataForSelectedDate.title}
                      </Text>
                    </Box>
                  )}
                {dataForSelectedDate.note &&
                  dataForSelectedDate.note.trim() !== "" && (
                    <Box mb={dataForSelectedDate.hours !== undefined ? 3 : 0}>
                      <Text fontWeight="bold">Anotação:</Text>
                      <Text
                        whiteSpace="pre-wrap"
                        fontSize="sm"
                        color="gray.600"
                      >
                        {dataForSelectedDate.note}
                      </Text>
                    </Box>
                  )}
                {dataForSelectedDate.hours !== undefined && (
                  <Box>
                    <Text fontWeight="bold">Horas Trabalhadas no Dia:</Text>
                    <Text fontSize="sm" color="gray.600">
                      {dataForSelectedDate.hours.toLocaleString("pt-BR")}
                    </Text>
                  </Box>
                )}
              </Box>
            )}
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
                  {totalProjectHours.toLocaleString("pt-BR")}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel textAlign="center">Horas Trabalhadas</StatLabel>
                <StatNumber
                  textAlign="center"
                  color={
                    workedHours > totalProjectHours ? "orange.500" : "green.500"
                  }
                >
                  {workedHours.toLocaleString("pt-BR")}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel textAlign="center">Horas Restantes</StatLabel>
                <StatNumber
                  textAlign="center"
                  color={
                    remainingHours < 0
                      ? "red.500"
                      : remainingHours === 0
                      ? "green.500"
                      : "inherit"
                  }
                >
                  {remainingHours.toLocaleString("pt-BR")}
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
