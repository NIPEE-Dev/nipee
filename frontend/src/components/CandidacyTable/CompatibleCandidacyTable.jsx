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
  Box,
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';
import { getDistrictName } from '../../utils/district';
import { useNavigate } from 'react-router-dom';
import { useJobs } from "./../../hooks/useJobs";

const CompatibleCandidacyTable = ({ candidates, jobId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { createInviteCompatible, loading, errorMessage, successMessage, clearMessages } = useJobs();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState([{ date: '', time: '' }]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [evaluation, setEvaluation] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = candidates?.slice(indexOfFirstItem, indexOfLastItem) || [];
  
  const totalPages = Math.ceil((candidates?.length || 0) / itemsPerPage);

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

  const handleViewProfile = (id) => navigate(`/candidates/view/${id}`);

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
      await createInviteCompatible(jobId, invitePayload);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar convite: ", error);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box>
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
                  <Flex gap={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => handleViewProfile(c.id)}>Ver Perfil</Button>
                    <Button size="xs" colorScheme="purple" onClick={() => openModal(c, 'INVITE')}>Convidar</Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
      <Flex mt={4} justify="center" align="center" gap={2}>
        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Text>Página {currentPage} de {totalPages}</Text>
        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </Flex>

      <Modal isOpen={!!modalType} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'INVITE' && 'Enviar Convite'}
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
          </ModalBody>
          <ModalFooter>
            {modalType === 'INVITE' && (
              <Button colorScheme="purple" onClick={handleSendInvite} isLoading={loading} loadingText="Enviando...">Enviar</Button>
            )}
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CompatibleCandidacyTable;
