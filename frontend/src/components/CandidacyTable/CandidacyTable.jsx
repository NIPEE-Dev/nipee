import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Badge,
  Flex,
  Link,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Input,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { FaFilePdf } from "react-icons/fa";
import { getDistrictName } from "../../utils/district";
import { useNavigate } from "react-router-dom";
import { CandidateJobStatusNew } from "../../utils/constants";
import { useJobs } from "./../../hooks/useJobs";

const JobCandidateStatusEnum = {
  PENDING: "1",
  APPROVED: "2",
  DENIED: "3",
  WAITING_RESPONSE: "4",
  INTERVIEWING: "5",
  INTERVIEW_REJECT_BY_USER: "6",
  TESTING: "7",
};

const statusColorMap = {
  1: "yellow", // PENDING
  4: "purple", // WAITING_RESPONSE
  5: "blue", // INTERVIEWING
  7: "orange", // TESTING
  2: "green", // APPROVED
  3: "red", // DENIED
  6: "red", // INTERVIEW_REJECT_BY_USER
};

const getStatusLabel = (status) => {
  const labels = {
    1: "Pendente",
    2: "Aprovado",
    3: "Reprovado",
    4: "Esperando resposta",
    5: "Em entrevista",
    6: "Entrevista rejeitada",
    7: "Em teste",
  };
  return labels[status] || "Desconhecido";
};

const CandidacyTable = ({ candidates, jobId, formValues }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    createInvite,
    updateJobInterviewEvaluation,
    updateJobInterviewTesting,
    loading,
    errorMessage,
    successMessage,
    clearMessages,
  } = useJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 10;
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [visibleCandidates, setVisibleCandidates] = useState(candidates || []);
  const [modalType, setModalType] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([{ date: "", time: "" }]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [evaluation, setEvaluation] = useState("");

  useEffect(() => {
    setVisibleCandidates(candidates || []);
    setCurrentPage(1);
  }, [candidates]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Erro",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      clearMessages();
    }
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
  }, [errorMessage, successMessage, clearMessages, toast]);

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates
    ? candidates.slice(indexOfFirstCandidate, indexOfLastCandidate)
    : [];

  const pageNumbers = [];
  if (candidates) {
    for (
      let i = 1;
      i <= Math.ceil(candidates.length / candidatesPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
  }

  const handleViewProfile = (id) => navigate(`/candidates/view/${id}`);

  const openModal = (candidate, type) => {
    setSelectedCandidate(candidate);
    setModalType(type);
    setSelectedSchedule(candidate.confirmedSchedule || "");
    setEvaluation("");
    setMessage("");
    setSchedules([{ date: "", time: "" }]);
  };

  const closeModal = () => {
    setSelectedCandidate(null);
    setModalType("");
  };

  const handleAddSchedule = () =>
    setSchedules([...schedules, { date: "", time: "" }]);
  const handleChangeSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSendInvite = async () => {
    if (!message.trim()) {
      toast({
        title: "Escreva uma mensagem para o candidato.",
        status: "error",
        duration: 2000,
      });
      return;
    }
    const hasValidSchedule = schedules.some((s) => s.date && s.time);
    if (!hasValidSchedule) {
      toast({
        title: "Adicione pelo menos um horário válido.",
        status: "error",
        duration: 2000,
      });
      return;
    }

    const invitePayload = {
      candidateId: selectedCandidate.id,
      message: message,
      schedules: schedules.filter((s) => s.date && s.time),
    };

    try {
      await createInvite(jobId, invitePayload);
      const formattedSchedules = schedules
        .filter((s) => s.date && s.time)
        .map((s) => ({
          date: s.date,
          time: s.time,
        }));

      updateLocalState(
        JobCandidateStatusEnum.WAITING_RESPONSE,
        null,
        formattedSchedules,
      );
      window.location.reload();

      closeModal();
    } catch (error) {
      console.error("Erro ao enviar convite: ", error);
    }
  };

  const handleEvaluation = async (approved, actionType) => {
    if (actionType === "reject" && !evaluation.trim()) {
      toast({
        title: "Preencha o motivo da reprovação.",
        status: "error",
        duration: 2000,
      });
      return;
    }

    if (
      (modalType === "INTERVIEW" || modalType === "TEST") &&
      !evaluation.trim()
    ) {
      toast({
        title: "Preencha a avaliação antes de continuar.",
        status: "error",
        duration: 2000,
      });
      return;
    }

    let evaluationPayload = {};
    let newStatus;
    let apiCall;
    let candidateIdToUpdate = selectedCandidate.id;

    if (modalType === "REJECT" || actionType === "reject") {
      evaluationPayload = {
        interviewEvaluation: evaluation,
        approved: false,
      };
      newStatus = JobCandidateStatusEnum.DENIED;
      apiCall = () =>
        updateJobInterviewEvaluation(
          jobId,
          candidateIdToUpdate,
          evaluationPayload,
        );
    } else if (modalType === "INTERVIEW") {
      evaluationPayload = {
        interviewEvaluation: evaluation,
        approved: approved,
      };
      newStatus = approved
        ? JobCandidateStatusEnum.TESTING
        : JobCandidateStatusEnum.DENIED;
      apiCall = () =>
        updateJobInterviewEvaluation(
          jobId,
          candidateIdToUpdate,
          evaluationPayload,
        );
    } else if (modalType === "TEST") {
      evaluationPayload = {
        testingEvaluation: evaluation,
        approved: approved,
      };
      newStatus = approved
        ? JobCandidateStatusEnum.APPROVED
        : JobCandidateStatusEnum.DENIED;
      apiCall = () =>
        updateJobInterviewTesting(
          jobId,
          candidateIdToUpdate,
          evaluationPayload,
        );
    }

    try {
      await apiCall();
      updateLocalState(newStatus, evaluation);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error(`Erro ao atualizar avaliação: `, error);
    }
  };

  const updateLocalState = (
    newStatus,
    evaluation = null,
    newSchedule = null,
  ) => {
    setVisibleCandidates((prev) =>
      prev.map((c) => {
        if (c.id === selectedCandidate.id) {
          const updates = {
            ...c,
            status: newStatus,
            statusLabel: getStatusLabel(newStatus),
          };

          if (evaluation !== null) {
            updates.evaluation = evaluation;
          }

          if (newSchedule) {
            updates.interviewSchedules = newSchedule;
          }

          return updates;
        }
        return c;
      }),
    );
  };

  const handleGenerateProtocol = (candidate) => {
    navigate("/contracts/add", {
      state: {
        preFill: {
          candidate: candidate,
          jobId: jobId,
          jobData: {
            has_scholarship: formValues.has_scholarship,
            scholarship_nominal_value: formValues.scholarship_nominal_value,
            transport_voucher: formValues.transport_voucher,
            transport_voucher_nominal_value:
              formValues.transport_voucher_nominal_value,
            transport_voucher_value: formValues.transport_voucher_value,
            scholarship_value: formValues.scholarship_value,
            type: formValues.type,
          },
          working_day: formValues.working_day,
          schoolId: candidate.schoolId,
          companyId: formValues.company_id,
        },
      },
    });
  };

  return (
    <div>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Currículo</Th>
              <Th>Género</Th>
              <Th>Curso</Th>
              <Th>Localidade</Th>
              <Th>Concelho</Th>
              <Th>Telemóvel</Th>
              <Th>Entrevista Agendada</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentCandidates.map((c) => (
              <Tr key={c.id}>
                <Td>{c.name}</Td>
                <Td>
                  {c.resume ? (
                    <Link
                      href={`${
                        import.meta.env.VITE_BACKEND_BASE_URL_EX
                      }/storage/${c.resume}`}
                      isExternal
                      color="purple.500"
                    >
                      <FaFilePdf size={20} />
                    </Link>
                  ) : (
                    <Text>Sem currículo</Text>
                  )}
                </Td>
                <Td>
                  {c.gender === "F"
                    ? "Feminino"
                    : c.gender === "M"
                    ? "Masculino"
                    : "N/A"}
                </Td>
                <Td>{c.course?.title || "N/A"}</Td>
                <Td>{getDistrictName(c.location) || "N/A"}</Td>
                <Td>{c.council || "N/A"}</Td>
                <Td>{c.phone || "N/A"}</Td>
                <Td>
                  {c.interviewSchedules && c.interviewSchedules.length > 0 ? (
                    <Text>
                      {c.interviewSchedules[0].date} às{" "}
                      {c.interviewSchedules[0].time}
                    </Text>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      Ainda não agendada
                    </Text>
                  )}
                </Td>
                <Td>
                  <Badge
                    colorScheme={statusColorMap[c.status]}
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {getStatusLabel(c.status) || "Desconhecido"}
                  </Badge>
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => handleViewProfile(c.id)}
                    >
                      Ver Perfil
                    </Button>
                    {c.status == 1 && (
                      <>
                        <Button
                          size="xs"
                          colorScheme="purple"
                          onClick={() => openModal(c, "INVITE")}
                        >
                          Marcar Entrevista
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => openModal(c, "REJECT")}
                        >
                          Reprovar
                        </Button>
                      </>
                    )}
                    {c.status == 5 && (
                      <Button
                        size="xs"
                        colorScheme="orange"
                        onClick={() => openModal(c, "INTERVIEW")}
                      >
                        Avaliar Entrevista
                      </Button>
                    )}
                    {c.status == 7 && (
                      <Button
                        size="xs"
                        colorScheme="teal"
                        onClick={() => openModal(c, "TEST")}
                      >
                        Avaliar Teste
                      </Button>
                    )}
                    {c.status == 2 && (
                      <Button
                        size="xs"
                        colorScheme="green"
                        leftIcon={<FaFilePdf />}
                        onClick={() => handleGenerateProtocol(c)}
                      >
                        Gerar Protocolo
                      </Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {candidates && candidates.length > candidatesPerPage && (
        <Flex justifyContent="center" mt={4} mb={4} gap={2}>
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            isDisabled={currentPage === 1}
          >
            Anterior
          </Button>
          {pageNumbers.map((number) => (
            <Button
              key={number}
              size="sm"
              onClick={() => setCurrentPage(number)}
              colorScheme={currentPage === number ? "blue" : "gray"}
            >
              {number}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  Math.ceil(candidates.length / candidatesPerPage),
                  prev + 1,
                ),
              )
            }
            isDisabled={
              currentPage === Math.ceil(candidates.length / candidatesPerPage)
            }
          >
            Próxima
          </Button>
        </Flex>
      )}

      <Modal isOpen={!!modalType} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === "INVITE" && "Enviar Convite"}
            {modalType === "INTERVIEW" && "Avaliação da Entrevista"}
            {modalType === "TEST" && "Avaliação do Teste"}
            {modalType === "REJECT" && "Reprovar Candidato"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === "INVITE" && (
              <>
                <Textarea
                  placeholder="Mensagem para o candidato..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  mb={4}
                />
                {schedules.map((s, i) => (
                  <Flex key={i} gap={2} mb={2}>
                    <Input
                      type="date"
                      value={s.date}
                      onChange={(e) =>
                        handleChangeSchedule(i, "date", e.target.value)
                      }
                    />
                    <Input
                      type="time"
                      value={s.time}
                      onChange={(e) =>
                        handleChangeSchedule(i, "time", e.target.value)
                      }
                    />
                  </Flex>
                ))}
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={handleAddSchedule}
                >
                  + Adicionar horário
                </Button>
              </>
            )}

            {(modalType === "INTERVIEW" || modalType === "TEST") && (
              <>
                <Textarea
                  placeholder="Avaliação"
                  value={evaluation}
                  onChange={(e) => setEvaluation(e.target.value)}
                  mb={4}
                />
              </>
            )}
            {modalType === "REJECT" && (
              <>
                <Text mb={2}>Por favor, insira o motivo da reprovação:</Text>
                <Textarea
                  placeholder="Motivo da reprovação..."
                  value={evaluation}
                  onChange={(e) => setEvaluation(e.target.value)}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {modalType === "INVITE" && (
              <Button
                colorScheme="purple"
                onClick={handleSendInvite}
                isLoading={loading}
                loadingText="Enviando..."
              >
                Enviar
              </Button>
            )}
            {(modalType === "INTERVIEW" || modalType === "TEST") && (
              <>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={() => handleEvaluation(true)}
                >
                  Aprovar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleEvaluation(false)}
                >
                  Reprovar
                </Button>
              </>
            )}
            {modalType === "REJECT" && (
              <Button
                colorScheme="red"
                onClick={() => handleEvaluation(false, "reject")}
                isLoading={loading}
              >
                Confirmar Reprovação
              </Button>
            )}
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CandidacyTable;
