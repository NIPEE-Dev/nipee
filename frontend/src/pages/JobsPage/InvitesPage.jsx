import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const mockInvitesInitial = [
  {
    id: 1,
    role: "Desenvolvedor React",
    company: "Tech Solutions",
    message: "Gostaríamos de convidá-lo para uma entrevista.",
    schedules: ["10/09 - 14h", "11/09 - 10h", "12/09 - 16h"],
    confirmedSchedule: "10/09 - 14h",
    jobId: 11,
  },
  {
    id: 2,
    role: "Analista de Dados",
    company: "DataCorp",
    message: "Temos interesse em seu perfil, escolha um horário para entrevista.",
    schedules: ["15/09 - 09h", "15/09 - 15h"],
    confirmedSchedule: null,
    jobId: 12,
  },
];

const InvitesPage = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState(mockInvitesInitial);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const accentColor = "purple.500";

  const handleViewInvite = (invite) => {
    setSelectedInvite(invite);
    setSelectedSchedule(invite.confirmedSchedule || "");
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedSchedule) {
      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvite.id
            ? { ...inv, confirmedSchedule: selectedSchedule }
            : inv
        )
      );
      setIsModalOpen(false);
    }
  };

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
              {invites.map((invite) => (
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
              ))}
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
                  {selectedInvite.schedules.map((time, i) => (
                    <Radio key={i} value={time}>
                      {time}
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
                    isDisabled={!selectedSchedule}
                >
                    Confirmar
                </Button>
                <Button
                    colorScheme="red"
                    onClick={() => {
                    setInvites((prev) =>
                        prev.filter((inv) => inv.id !== selectedInvite.id)
                    );
                    setIsModalOpen(false);
                    }}
                >
                    Rejeitar
                </Button>
                </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default InvitesPage;
