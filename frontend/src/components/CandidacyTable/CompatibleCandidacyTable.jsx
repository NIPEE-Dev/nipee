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
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';
import { getDistrictName } from '../../utils/district';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case '1':
      return 'yellow';
    case '2':
      return 'green';
    case '3':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case '1':
      return 'Pendente';
    case '2':
      return 'Aprovado';
    case '3':
      return 'Reprovado';
    default:
      return 'Desconhecido';
  }
};

const CompatibleCandidacyTable = ({ candidates }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState([{ date: '', time: '' }]);
  const [visibleCandidates, setVisibleCandidates] = useState(candidates || []);

  const handleViewProfile = (id) => {
    navigate(`/candidates/view/${id}`);
  };

  const handleInvite = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleReject = (id) => {
    setVisibleCandidates((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: 'Candidato rejeitado.',
      description: 'Ele foi removido da lista desta vaga.',
      status: 'info',
      duration: 2000,
    });
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { date: '', time: '' }]);
  };

  const handleChangeSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSendInvite = () => {
    toast({
      title: `Convite enviado para ${selectedCandidate.name}!`,
      status: 'success',
      duration: 2000,
    });

    setIsModalOpen(false);
    setMessage('');
    setSchedules([{ date: '', time: '' }]);
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
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleCandidates && visibleCandidates.length > 0 ? (
              visibleCandidates.map((candidate) => (
                <Tr key={candidate.id}>
                  <Td>{candidate.name || 'N/A'}</Td>
                  <Td>
                    {candidate.resume ? (
                      <Link
                        href={`${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${candidate.resume}`}
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
                    {candidate.gender === 'F'
                      ? 'Feminino'
                      : candidate.gender === 'M'
                      ? 'Masculino'
                      : 'N/A'}
                  </Td>
                  <Td>{candidate.course?.title || 'N/A'}</Td>
                  <Td>{getDistrictName(candidate.location) || 'N/A'}</Td>
                  <Td>{candidate.council || 'N/A'}</Td>
                  <Td>{candidate.phone || 'N/A'}</Td>
                  <Td>
                    <Badge
                      colorScheme={getStatusColor(candidate.status)}
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {getStatusLabel(candidate.status)}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => handleViewProfile(candidate.id)}
                      >
                        Ver Perfil
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="purple"
                        onClick={() => handleInvite(candidate)}
                      >
                        Convidar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleReject(candidate.id)}
                      >
                        Rejeitar
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  <Text py={4}>Nenhum candidato é compatível a esta vaga ainda.</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enviar convite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Mensagem para o candidato..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              mb={4}
            />

            {schedules.map((schedule, index) => (
              <Flex key={index} gap={2} mb={2}>
                <Input
                  type="date"
                  value={schedule.date}
                  onChange={(e) => handleChangeSchedule(index, 'date', e.target.value)}
                />
                <Input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => handleChangeSchedule(index, 'time', e.target.value)}
                />
              </Flex>
            ))}

            <Button size="sm" onClick={handleAddSchedule} colorScheme="teal">
              + Adicionar horário
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleSendInvite}>
              Enviar convite
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CompatibleCandidacyTable;
