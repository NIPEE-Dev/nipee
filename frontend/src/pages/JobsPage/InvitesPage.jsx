import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Stack,
  Radio,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "./../../hooks/useJobs";

const InvitesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { 
    myInvites, 
    loading, 
    errorMessage, 
    successMessage,
    getJobsInvite, 
    updateJobInterview, 
    clearMessages 
  } = useJobs();
  
  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  useEffect(() => {
    getJobsInvite();
  }, [getJobsInvite]);

  useEffect(() => {
    if (myInvites) {
      const formattedInvites = myInvites.map(invite => {
        const confirmedSchedule = invite.interviewDate && invite.interviewTime
          ? `${new Date(invite.interviewDate).toLocaleDateString('pt-BR')} - ${invite.interviewTime.substring(0, 5)}`
          : null;
        
        const schedules = invite.schedule.map(s => {
          const date = new Date(s.date).toLocaleDateString('pt-BR');
          const time = s.time.substring(0, 5);
          return { id: s.id, time: `${date} - ${time}` }; 
        });

        return {
          id: invite.id,
          role: invite.job,
          company: invite.company,
          message: invite.message,
          schedules: schedules,
          confirmedSchedule: confirmedSchedule,
          jobId: invite.jobId,
        };
      });
      setInvites(formattedInvites);
    }
  }, [myInvites]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Sucesso!",
        description: successMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      clearMessages();
    }
    if (errorMessage) {
      toast({
        title: "Erro!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      clearMessages();
    }
  }, [successMessage, errorMessage, toast, clearMessages]);

  const handleViewInvite = (invite) => {
    setSelectedInvite(invite);
    setSelectedSchedule(invite.confirmedSchedule || "");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedSchedule) {
      try {
        await updateJobInterview(selectedInvite.id, {
          scheduleId: Number(selectedSchedule),
          confirmed: true
        });

        setInvites((prev) =>
          prev.map((inv) =>
            inv.id === selectedInvite.id
              ? {
                  ...inv,
                  confirmedSchedule: selectedInvite.schedules.find(
                    (s) => s.id === Number(selectedSchedule)
                  )?.time
                }
              : inv
          )
        );

        setIsModalOpen(false);
      } catch (error) {
        console.error("Erro ao confirmar entrevista:", error);
      }
    }
  };

  const handleReject = async () => {
    try {
      const firstScheduleId = selectedInvite.schedules[0]?.id;
      await updateJobInterview(selectedInvite.id, { 
        scheduleId: firstScheduleId,
        confirmed: false 
      });
      setInvites((prev) => prev.filter((inv) => inv.id !== selectedInvite.id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao rejeitar convite:", error);
    }
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" color={accentColor} mt={20} />
      </Container>
    );
  }

  if (errorMessage && !isModalOpen) {
    return (
      <Container centerContent>
        <Alert status="error" mt={10} maxW="md">
          <AlertIcon />
          {errorMessage}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
          Convites Recebidos
        </Heading>
        <Text fontSize="lg" textAlign="center" color={textColor}>
          Veja os convites que você recebeu das empresas.
        </Text>

        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr bg={headerBg}>
                <Th color={textColor}>Vaga</Th>
                <Th color={textColor}>Empresa</Th>
                <Th color={textColor}>Entrevista marcada para</Th>
                <Th color={textColor}>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invites.length > 0 ? (
                invites.map((invite) => (
                  <Tr key={invite.id}>
                    <Td color={textColor}>{invite.role}</Td>
                    <Td color={textColor}>{invite.company}</Td>
                    <Td color={textColor}>
                      {invite.confirmedSchedule || "Ainda não marcada"}
                    </Td>
                    <Td>
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          onClick={() => handleViewInvite(invite)}
                        >
                          Ver Convite
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="gray"
                          onClick={() =>
                            navigate(`/jobs-candidate/${invite.jobId}`)
                          }
                        >
                          Ver Detalhes da Vaga
                        </Button>
                      </Stack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center" color={textColor}>
                    Nenhum convite recebido.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Modal Convite */}
      {selectedInvite && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Convite para Entrevista</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" mb={2}>
                Empresa: {selectedInvite.company}
              </Text>
              <Text mb={4}>{selectedInvite.message}</Text>

              <Text fontWeight="bold" mb={2}>
                Escolha um horário:
              </Text>
              <RadioGroup
                value={selectedSchedule}
                onChange={setSelectedSchedule}
              >
                <Stack direction="column">
                  {selectedInvite.schedules.map((s) => (
                    <Radio key={s.id} value={s.id.toString()}>
                      {s.time}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="purple"
                mr={3}
                onClick={handleConfirm}
                isDisabled={!selectedSchedule || loading}
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleReject}
                isDisabled={loading}
              >
                {loading ? "Rejeitando..." : "Rejeitar"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default InvitesPage;
