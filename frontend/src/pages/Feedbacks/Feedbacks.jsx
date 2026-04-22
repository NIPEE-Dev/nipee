import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MdAdd, MdVisibility } from "react-icons/md";
import { createFeedback, getFeedbacks } from "../../services/feedbackService";

const initialStudents = [
  {
    id: 1,
    nome: "Mariana Costa",
    nif: "245781369",
    empresa: "TechVision",
    funcao: "Assistente de Suporte",
    escola: "Escola Secundaria do Porto",
    feedbackEmpresa:
      "Boa adaptacao ao ambiente de trabalho e evolucao consistente nas atividades diarias.",
  },
  {
    id: 2,
    nome: "Tiago Martins",
    nif: "256904118",
    empresa: "Logistica Prime",
    funcao: "Auxiliar Administrativo",
    escola: "Escola Profissional de Gaia",
    feedbackEmpresa: "",
  },
  {
    id: 3,
    nome: "Beatriz Almeida",
    nif: "238671450",
    empresa: "Clinica Viva",
    funcao: "Apoio Tecnico de Saude",
    escola: "Escola Tecnica de Braga",
    feedbackEmpresa:
      "Mantem boa relacao com a equipa e demonstra responsabilidade no atendimento.",
  },
  {
    id: 4,
    nome: "Rafael Sousa",
    nif: "249118530",
    empresa: "Inova Digital",
    funcao: "Assistente de Marketing",
    escola: "Escola Profissional de Lisboa",
    feedbackEmpresa: "",
  },
];

const emptyFeedbackForm = {
  alunoId: "",
  anotacao: "",
};

export const Feedbacks = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile") || "null");
  const userRole = userProfile?.role || "";
  const canCreateFeedback =
    userRole === "Empresa" || userRole === "Administrador Geral" || !userRole;

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
    const selectedStudent = students.find(
      (student) => student.candidate.id === studentId,
    );

    setFeedbackForm({
      alunoId: studentId ? String(studentId) : "",
      anotacao: selectedStudent?.feedback.annotation || "",
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
      await createFeedback(feedbackForm.alunoId, {
        annotation: feedbackForm.anotacao,
      });
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
              const hasFeedback = Boolean(student.feedback.annotation);

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
                      {hasFeedback ? "Com anotacao" : "Sem anotacao"}
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
                          {hasFeedback
                            ? "Editar feedback"
                            : "Adicionar feedback"}
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
                          Ver anotacao
                        </Button>
                      ) : (
                        <Text fontSize="sm" color="gray.500" alignSelf="center">
                          Nenhuma anotacao registrada
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
            {feedbackForm.anotacao ? "Editar feedback" : "Adicionar feedback"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Aluno</FormLabel>
              <Select
                placeholder="Selecione o aluno"
                value={feedbackForm.alunoId}
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
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={Boolean(viewingFeedback)}
        onClose={handleCloseViewModal}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Anotacao do aluno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb={1}>
              {viewingFeedback?.candidate.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              NIF {viewingFeedback?.candidate.nif}
            </Text>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              bg="gray.50"
            >
              <Text whiteSpace="pre-wrap">
                {viewingFeedback?.feedback.annotation ||
                  "Nenhuma anotacao registrada."}
              </Text>
            </Box>
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
