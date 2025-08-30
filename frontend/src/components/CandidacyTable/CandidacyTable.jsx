import React, { useState, useEffect } from 'react';
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
  Radio
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';
import { getDistrictName } from '../../utils/district';
import { useNavigate } from 'react-router-dom';
import { CandidateJobStatusNew } from '../../utils/constants';
import { useJobs } from "./../../hooks/useJobs";

const statusColorMap = {
  1: 'yellow', // PENDING
  4: 'purple', // WAITING_RESPONSE
  5: 'blue',   // INTERVIEWING
  7: 'orange', // TESTING
  2: 'green',  // APPROVED
  3: 'red',    // DENIED
  6: 'red',    // INTERVIEW_REJECT_BY_USER
};

const CandidacyTable = ({ candidates, jobId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { createInvite, loading, errorMessage, successMessage, clearMessages } = useJobs();

  const [visibleCandidates, setVisibleCandidates] = useState(candidates || []);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState([{ date: '', time: '' }]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [evaluation, setEvaluation] = useState('');

  const handleViewProfile = (id) => navigate(`/candidates/view/${id}`);

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

  const handleReject = (id) => {
    setVisibleCandidates((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: 'Candidato rejeitado',
      status: 'info',
      duration: 2000,
    });
  };

  const openModal = (candidate, type) => {
    setSelectedCandidate(candidate);
    setModalType(type);
    setSelectedSchedule(candidate.confirmedSchedule || '');
    setEvaluation('');
    setMessage('');
    setSchedules([{ date: '', time: '' }]);
  };

  const closeModal = () => {
    setSelectedCandidate(null);
    setModalType('');
  };

  const handleAddSchedule = () => setSchedules([...schedules, { date: '', time: '' }]);
  const handleChangeSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSendInvite = async () => {
    if (!message.trim()) {
      toast({ title: 'Escreva uma mensagem para o candidato.', status: 'error', duration: 2000 });
      return;
    }
    const hasValidSchedule = schedules.some((s) => s.date && s.time);
    if (!hasValidSchedule) {
      toast({ title: 'Adicione pelo menos um horário válido.', status: 'error', duration: 2000 });
      return;
    }

    const invitePayload = {
      candidateId: selectedCandidate.id,
      message: message,
      schedules: schedules.filter(s => s.date && s.time),
    };

    try {
      await createInvite(jobId, invitePayload);
      setVisibleCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id
            ? {
                ...c,
                status: CandidateJobStatusNew.CALLED,
              }
            : c
        )
      );
      closeModal();
    } catch (error) {
      console.error("Erro ao enviar convite: ", error);
    }
  };

  const handleEvaluation = (approved) => {
    if (!evaluation.trim()) {
      toast({ title: 'Preencha a avaliação antes de continuar.', status: 'error', duration: 2000 });
      return;
    }

    setVisibleCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id
          ? {
              ...c,
              status: approved
                ? modalType === 'INTERVIEW'
                  ? CandidateJobStatusNew.IN_TESTS
                  : CandidateJobStatusNew.HIRED
                : 6,
              evaluation,
            }
          : c
      )
    );
    toast({
      title: approved ? 'Aprovado!' : 'Reprovado!',
      status: approved ? 'success' : 'error',
      duration: 2000,
    });
    closeModal();
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
            {visibleCandidates.map((c) => (
              <Tr key={c.id}>
                <Td>{c.name}</Td>
                <Td>
                  {c.resume ? (
                    <Link
                      href={`${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${c.resume}`}
                      isExternal
                      color="purple.500"
                    >
                      <FaFilePdf size={20} />
                    </Link>
                  ) : (
                    <Text>Sem currículo</Text>
                  )}
                </Td>
                <Td>{c.gender === 'F' ? 'Feminino' : c.gender === 'M' ? 'Masculino' : 'N/A'}</Td>
                <Td>{c.course?.title || 'N/A'}</Td>
                <Td>{getDistrictName(c.location) || 'N/A'}</Td>
                <Td>{c.council || 'N/A'}</Td>
                <Td>{c.phone || 'N/A'}</Td>
                <Td>
                  {c.interviewSchedules && c.interviewSchedules.length > 0 ? (
                    <Text>
                      {c.interviewSchedules[0].date} às {c.interviewSchedules[0].time}
                    </Text>
                  ) : (
                    <Text color="gray.500" fontSize="sm">Ainda não agendada</Text>
                  )}
                </Td>
                <Td>
                  <Badge 
                    colorScheme={statusColorMap[c.status]} 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                  >
                    {c.statusLabel || 'Desconhecido'}
                  </Badge>
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => handleViewProfile(c.id)}>Ver Perfil</Button>
                    {c.status == 1 && (
                      <>
                        <Button size="xs" colorScheme="purple" onClick={() => openModal(c, 'INVITE')}>Marcar Entrevista</Button>
                        <Button size="xs" colorScheme="red" onClick={() => handleReject(c.id)}>Rejeitar</Button>
                      </>
                    )}
                    {c.status == 5 && (
                      <Button size="xs" colorScheme="orange" onClick={() => openModal(c, 'INTERVIEW')}>Avaliar Entrevista</Button>
                    )}
                    {c.status == 7 && (
                      <Button size="xs" colorScheme="teal" onClick={() => openModal(c, 'TEST')}>Avaliar Teste</Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={!!modalType} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'INVITE' && 'Enviar Convite'}
            {modalType === 'INTERVIEW' && 'Avaliação da Entrevista'}
            {modalType === 'TEST' && 'Avaliação do Teste'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === 'INVITE' && (
              <>
                <Textarea
                  placeholder="Mensagem para o candidato..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  mb={4}
                />
                {schedules.map((s, i) => (
                  <Flex key={i} gap={2} mb={2}>
                    <Input type="date" value={s.date} onChange={(e) => handleChangeSchedule(i, 'date', e.target.value)} />
                    <Input type="time" value={s.time} onChange={(e) => handleChangeSchedule(i, 'time', e.target.value)} />
                  </Flex>
                ))}
                <Button size="sm" colorScheme="teal" onClick={handleAddSchedule}>+ Adicionar horário</Button>
              </>
            )}

            {(modalType === 'INTERVIEW' || modalType === 'TEST') && (
              <>
                <Textarea
                  placeholder="Avaliação"
                  value={evaluation}
                  onChange={(e) => setEvaluation(e.target.value)}
                  mb={4}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {modalType === 'INVITE' && (
              <Button colorScheme="purple" onClick={handleSendInvite} isLoading={loading} loadingText="Enviando...">Enviar</Button>
            )}
            {(modalType === 'INTERVIEW' || modalType === 'TEST') && (
              <>
                <Button colorScheme="green" mr={3} onClick={() => handleEvaluation(true)}>Aprovar</Button>
                <Button colorScheme="red" onClick={() => handleEvaluation(false)}>Reprovar</Button>
              </>
            )}
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CandidacyTable;
