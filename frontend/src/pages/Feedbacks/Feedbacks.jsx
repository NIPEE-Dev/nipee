import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { MdAdd, MdEdit, MdVisibility } from "react-icons/md";
import {
  createFeedback,
  getFeedbacks,
  updateFeedback,
} from "../../services/feedbackService";

const emptyFeedbackForm = {
  alunoId: "",
  anotacao: "",
  feedbackId: "",
  isEditing: false,
};

const getStudentFeedbacks = (student) => {
  if (!student) {
    return [];
  }

  if (Array.isArray(student.feedbacks)) {
    return student.feedbacks.filter((feedback) => feedback?.annotation);
  }

  if (Array.isArray(student.feedback)) {
    return student.feedback.filter((feedback) => feedback?.annotation);
  }

  if (student.feedback?.annotation) {
    return [student.feedback];
  }

  return [];
};

const formatFeedbackDateTime = (value) => {
  if (!value) {
    return "Data e hora nao informadas";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data e hora nao informadas";
  }

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const getFeedbackDateValue = (feedback) =>
  feedback?.createdAt ||
  feedback?.created_at ||
  feedback?.updatedAt ||
  feedback?.updated_at ||
  feedback?.date ||
  feedback?.datetime;

export const Feedbacks = () => {
  const toast = useToast();
  const userProfile = JSON.parse(localStorage.getItem("profile") || "null");
  const userRole = userProfile?.role || "";
  const isEmpresa = userRole === "Empresa";
  const canCreateFeedback =
    userRole === "Empresa" || userRole === "Administrador Geral" || !userRole;
  const canUpdateFeedback = isEmpresa;

  const [students, setStudents] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState(emptyFeedbackForm);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  async function fetchFeedbacks() {
    const res = await getFeedbacks();
    setStudents(res.data.data);
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const studentsOptions = useMemo(
    () =>
      students.map((student) => ({
        value: String(student.candidate.id),
        label: `${student.candidate.name} - NIF ${student.candidate.nif}`,
      })),
    [students],
  );

  const openCreateFeedbackModal = (studentId = "") => {
    setFeedbackForm({
      alunoId: studentId ? String(studentId) : "",
      anotacao: "",
      feedbackId: "",
      isEditing: false,
    });
    setIsFeedbackModalOpen(true);
  };

  const openUpdateFeedbackModal = (student, feedback) => {
    setViewingFeedback(null);
    setFeedbackForm({
      alunoId: String(student.candidate.id),
      anotacao: feedback.annotation || "",
      feedbackId: feedback.id ? String(feedback.id) : "",
      isEditing: true,
    });
    setIsFeedbackModalOpen(true);
  };

  const closeCreateFeedbackModal = () => {
    setFeedbackForm(emptyFeedbackForm);
    setIsFeedbackModalOpen(false);
  };

  const handleSaveFeedback = async () => {
    if (!feedbackForm.alunoId || !feedbackForm.anotacao.trim()) {
      return;
    }

    try {
      const payload = {
        annotation: feedbackForm.anotacao,
        ...(feedbackForm.feedbackId && { id: feedbackForm.feedbackId }),
        ...(feedbackForm.isEditing
          ? { updatedAt: new Date().toISOString() }
          : { createdAt: new Date().toISOString() }),
      };

      if (feedbackForm.isEditing) {
        await updateFeedback(
          feedbackForm.alunoId,
          feedbackForm.feedbackId,
          payload,
        );
      } else {
        await createFeedback(feedbackForm.alunoId, payload);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    await fetchFeedbacks();
    closeCreateFeedbackModal();
  };

  const handleOpenViewModal = (student) => {
    setViewingFeedback(student);
  };

  const handleCloseViewModal = () => {
    setViewingFeedback(null);
  };

  const viewingStudentFeedbacks = getStudentFeedbacks(viewingFeedback);

  return (
    <Box p={6}>
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="lg" mb={2}>
            Feedbacks
          </Heading>
          <Text color="gray.600">
            Acompanhe os alunos em atividade e consulte as anotacoes
            registradas.
          </Text>
        </Box>

        {canCreateFeedback && (
          <Button
            leftIcon={<MdAdd />}
            colorScheme="blue"
            onClick={() => openCreateFeedbackModal()}
          >
            Adicionar feedback
          </Button>
        )}
      </Flex>

      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        bg="white"
      >
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th>Nome do aluno</Th>
              <Th>Empresa</Th>
              <Th>Funcao</Th>
              <Th>Escola</Th>
              <Th>Status</Th>
              <Th>Acoes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => {
              const studentFeedbacks = getStudentFeedbacks(student);
              const feedbackCount = studentFeedbacks.length;
              const hasFeedback = feedbackCount > 0;

              return (
                <Tr key={student.id}>
                  <Td>{student.candidate.name}</Td>
                  <Td>{student.company.name}</Td>
                  <Td>{student.job.role}</Td>
                  <Td>{student.school.name}</Td>
                  <Td>
                    <Badge
                      colorScheme={hasFeedback ? "green" : "yellow"}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {hasFeedback
                        ? `${feedbackCount} feedback${
                            feedbackCount > 1 ? "s" : ""
                          }`
                        : "Sem feedback"}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2} wrap="wrap">
                      {canCreateFeedback && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openCreateFeedbackModal(student.candidate.id)
                          }
                        >
                          Adicionar feedback
                        </Button>
                      )}

                      {hasFeedback ? (
                        <Button
                          size="sm"
                          leftIcon={<MdVisibility />}
                          colorScheme="blue"
                          variant={canCreateFeedback ? "ghost" : "outline"}
                          onClick={() => handleOpenViewModal(student)}
                        >
                          Ver feedbacks
                        </Button>
                      ) : (
                        <Text fontSize="sm" color="gray.500" alignSelf="center">
                          Nenhum feedback registrado
                        </Text>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={closeCreateFeedbackModal}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {feedbackForm.isEditing
              ? "Atualizar feedback"
              : "Adicionar feedback"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Aluno</FormLabel>
              <Select
                placeholder="Selecione o aluno"
                value={feedbackForm.alunoId}
                isDisabled={feedbackForm.isEditing}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    alunoId: event.target.value,
                  }))
                }
              >
                {studentsOptions.map((student) => (
                  <option key={student.value} value={student.value}>
                    {student.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Anotacao</FormLabel>
              <Textarea
                placeholder="Escreva o feedback sobre o aluno"
                rows={6}
                value={feedbackForm.anotacao}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    anotacao: event.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={closeCreateFeedbackModal}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSaveFeedback}>
              {feedbackForm.isEditing ? "Atualizar" : "Salvar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={Boolean(viewingFeedback)}
        onClose={handleCloseViewModal}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedbacks do aluno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb={1}>
              {viewingFeedback?.candidate.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              NIF {viewingFeedback?.candidate.nif}
            </Text>
            <Stack spacing={4}>
              {viewingStudentFeedbacks.map((feedback, index) => (
                <Box
                  key={
                    feedback.id || `${getFeedbackDateValue(feedback)}-${index}`
                  }
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  bg="gray.50"
                >
                  <Flex
                    align={{ base: "flex-start", md: "center" }}
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                    gap={2}
                    mb={3}
                  >
                    <Text fontWeight="semibold">Feedback {index + 1}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatFeedbackDateTime(getFeedbackDateValue(feedback))}
                    </Text>
                  </Flex>
                  <Divider mb={3} />
                  <Text whiteSpace="pre-wrap">{feedback.annotation}</Text>
                  {canUpdateFeedback && (
                    <Flex justify="flex-end" mt={4}>
                      <Button
                        size="sm"
                        leftIcon={<MdEdit />}
                        variant="outline"
                        colorScheme="blue"
                        onClick={() =>
                          openUpdateFeedbackModal(viewingFeedback, feedback)
                        }
                      >
                        Atualizar feedback
                      </Button>
                    </Flex>
                  )}
                </Box>
              ))}

              {!viewingStudentFeedbacks.length && (
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  bg="gray.50"
                >
                  <Text>Nenhum feedback registrado.</Text>
                </Box>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseViewModal}>Fechar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Feedbacks;
