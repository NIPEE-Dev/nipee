import React, { useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, Table, Tbody, Tr, Td, Th, Thead,
  Badge, HStack, Text, Link, Icon, Spinner, Center
} from "@chakra-ui/react";
import { FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";
import { useCandidateHistory } from "../../hooks/useCandidateHistory";
import api from "../../api";

const HistoryModal = ({ isOpen, onClose, studentName, candidateId }) => {
  const { history, loading, fetchHistory, downloadHistory } = useCandidateHistory();
  
  const baseURL = api.defaults.baseURL;

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchHistory(candidateId);
    }
  }, [isOpen, candidateId, fetchHistory]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid #eee">
          Histórico de FCT: <Text as="span" color="#5C3BEB">{studentName}</Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading ? (
            <Center p={10}>
              <Spinner size="xl" color="#5C3BEB" thickness="4px" />
            </Center>
          ) : (
            <Table variant="simple" size="sm">
              <Thead bg="#f4f4f4">
                <Tr>
                  <Th>Empresa</Th>
                  <Th>Período</Th>
                  <Th>Carga Horária</Th>
                  <Th>Avaliação</Th>
                  <Th>Documentos</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history && history.length > 0 ? (
                  history.map((item, index) => (
                    <Tr key={index}>
                      <Td fontWeight="bold">{item.company}</Td>
                      <Td fontSize="xs">
                        {formatDate(item.startDate)} a {formatDate(item.endDate)}
                      </Td>
                      <Td>{item.totalHours}h</Td>
                      <Td>
                        <Badge colorScheme="purple">
                          {item.evaluation ? `${item.evaluation} val` : "N/A"}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={3}>
                          {item.fctReportPath && (
                            <Link 
                              href={`${baseURL}/storage/${item.fctReportPath}`} 
                              color="#5C3BEB" 
                              fontSize="xs" 
                              isExternal
                            >
                              <Icon as={FaDownload} mr={1} /> Relatório
                            </Link>
                          )}
                          {item.fctEvaluationPath && (
                            <Link 
                              href={`${baseURL}/storage/${item.fctEvaluationPath}`} 
                              color="#5C3BEB" 
                              fontSize="xs" 
                              isExternal
                            >
                              <Icon as={FaDownload} mr={1} /> Avaliação
                            </Link>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={10}>
                      <Text color="gray.500">Nenhum registro de histórico encontrado.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </ModalBody>

        <ModalFooter gap={3}>
          <Button 
            leftIcon={<FaFilePdf />} 
            colorScheme="red" 
            variant="outline" 
            size="sm"
            onClick={() => downloadHistory(candidateId, 'pdf')}
            isLoading={loading}
            isDisabled={!history || history.length === 0}
          >
            Exportar PDF
          </Button>
          <Button 
            leftIcon={<FaFileExcel />} 
            colorScheme="green" 
            variant="outline" 
            size="sm"
            onClick={() => downloadHistory(candidateId, 'excel')}
            isLoading={loading}
            isDisabled={!history || history.length === 0}
          >
            Exportar Excel
          </Button>
          <Button onClick={onClose} variant="ghost">Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HistoryModal;