import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, Table, Tbody, Tr, Td, Th, Thead,
  Badge, HStack, Select, Input, Box, Text, Link, Icon
} from "@chakra-ui/react";
import { FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";

const HistoryModal = ({ isOpen, onClose, studentName }) => {
  // Mock de dados - Em breve virá do Backend
  const mockHistory = [
    {
      id: 1,
      empresa: "Tech Solutions Portugal",
      curso: "Informática de Gestão",
      anoLetivo: "2023/2024",
      cargaHoraria: "400h",
      dataInicio: "2023-09-01",
      dataFim: "2024-02-15",
      avaliacao: "18",
      relatorioUrl: "#",
      avaliacaoUrl: "#",
    },
    {
      id: 2,
      empresa: "Global Services",
      curso: "Informática de Gestão",
      anoLetivo: "2022/2023",
      cargaHoraria: "200h",
      dataInicio: "2022-10-10",
      dataFim: "2022-12-20",
      avaliacao: "16",
      relatorioUrl: "#",
      avaliacaoUrl: "#",
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid #eee">
          Histórico de FCT: <Text as="span" color="#5C3BEB">{studentName}</Text>
          <Badge ml={2} colorScheme="green">Concluído</Badge>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>

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
              {mockHistory.map((item) => (
                <Tr key={item.id}>
                  <Td fontWeight="bold">{item.empresa}</Td>
                  <Td fontSize="xs">{item.dataInicio} a {item.dataFim}</Td>
                  <Td>{item.cargaHoraria}</Td>
                  <Td>
                    <Badge colorScheme="purple">{item.avaliacao} val</Badge>
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Link href={item.relatorioUrl} color="#5C3BEB" fontSize="xs" isExternal>
                        <Icon as={FaDownload} mr={1} /> Relatório
                      </Link>
                      <Link href={item.avaliacaoUrl} color="#5C3BEB" fontSize="xs" isExternal>
                        <Icon as={FaDownload} mr={1} /> Avaliação
                      </Link>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button leftIcon={<FaFilePdf />} colorScheme="red" variant="outline" size="sm">
            Exportar PDF
          </Button>
          <Button leftIcon={<FaFileExcel />} colorScheme="green" variant="outline" size="sm">
            Exportar Excel
          </Button>
          <Button onClick={onClose} variant="ghost">Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HistoryModal;