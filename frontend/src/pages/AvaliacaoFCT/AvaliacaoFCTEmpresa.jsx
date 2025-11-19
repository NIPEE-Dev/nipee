import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Divider,
  useToast,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  MdAssignment,
  MdFileDownload,
  MdUploadFile,
  MdCheckCircle,
  MdPictureAsPdf,
} from "react-icons/md";

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "João Silva",
    school: "Escola Técnica A",
    course: "Técnico de Informática",
    status: "pending",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    school: "Escola Profissional B",
    course: "Gestão",
    status: "generated",
  },
  {
    id: 3,
    name: "Carlos Souza",
    school: "Escola Técnica A",
    course: "Multimédia",
    status: "completed", 
  },
];

const EVALUATION_PARAMS = [
  "Qualidade e organização de Trabalho",
  "Integração e Adaptação ao Contexto de Trabalho",
  "Empenho e interesse nas funções desempenhadas",
  "Capacidade de Aprendizagem no trabalho",
  "Capacidade de Trabalhar em Equipa",
  "Espírito de Iniciativa",
  "Qualidade do Trabalho realizado",
  "Ritmo de Trabalho",
  "Comunicação",
  "Aplicações das normas de segurança",
  "Assiduidade e pontualidade",
  "Apresentação pessoal",
  "Relacionamento interpessoal",
  "Apropriação da cultura da empresa",
  "Autonomia",
  "Relacionamento com a chefia",
];

const EvaluationFormModal = ({ isOpen, onClose, candidate, onConfirm }) => {
  const [scores, setScores] = useState(
    EVALUATION_PARAMS.reduce((acc, param) => ({ ...acc, [param]: 0 }), {})
  );

  const handleScoreChange = (param, value) => {
    setScores((prev) => ({
      ...prev,
      [param]: parseInt(value) || 0,
    }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const finalAverage = (totalScore / 16).toFixed(2);

  const getClassificationLabel = (val) => {
    if (val < 7) return "Muito Insuficiente";
    if (val < 10) return "Insuficiente";
    if (val < 14) return "Suficiente";
    if (val < 18) return "Bom";
    return "Muito Bom";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Avaliação Final - {candidate?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.500">
              Preencha as classificações de 0 a 20. A média será calculada automaticamente.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {EVALUATION_PARAMS.map((param, index) => (
                <FormControl key={index} display="flex" justifyContent="space-between" alignItems="center">
                  <FormLabel fontSize="sm" mb={0} maxW="70%">
                    {index + 1}. {param}
                  </FormLabel>
                  <NumberInput
                    size="sm"
                    maxW="80px"
                    min={0}
                    max={20}
                    value={scores[param]}
                    onChange={(val) => handleScoreChange(param, val)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              ))}
            </SimpleGrid>

            <Divider />

            <HStack justifyContent="space-between" bg="gray.50" p={4} borderRadius="md">
              <VStack align="flex-start" spacing={0}>
                <Text fontWeight="bold">Classificação Final</Text>
                <Text fontSize="xs">(Somatório das classificações / 16)</Text>
              </VStack>
              <VStack align="flex-end" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {finalAverage}
                </Text>
                <Tag size="sm" colorScheme={finalAverage >= 10 ? "green" : "red"}>
                  {getClassificationLabel(finalAverage)}
                </Tag>
              </VStack>
            </HStack>
            
            <SimpleGrid columns={5} spacing={2} fontSize="xs" textAlign="center" bg="yellow.50" p={2} border="1px solid #e2e8f0">
               <Box>0-6<br/>Muito Insuficiente</Box>
               <Box>7-9<br/>Insuficiente</Box>
               <Box>10-13<br/>Suficiente</Box>
               <Box>14-17<br/>Bom</Box>
               <Box>18-20<br/>Muito Bom</Box>
            </SimpleGrid>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={() => onConfirm(finalAverage)}>
            Gerar Documento PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UploadSignedModal = ({ isOpen, onClose, onConfirm }) => {
  const [file, setFile] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Anexar Avaliação Assinada</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="sm">
              Baixe o documento gerado, assine-o manualmente ou digitalmente e anexe o PDF final aqui.
            </Text>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: "100%" }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="orange"
            isDisabled={!file}
            onClick={() => onConfirm(file)}
            leftIcon={<MdUploadFile />}
          >
            Submeter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AvaliacaoFCTEmpresa = () => {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const { 
    isOpen: isEvalOpen, 
    onOpen: onEvalOpen, 
    onClose: onEvalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isUploadOpen, 
    onOpen: onUploadOpen, 
    onClose: onUploadClose 
  } = useDisclosure();

  const toast = useToast();

  const handleOpenEvaluation = (candidate) => {
    setSelectedCandidate(candidate);
    onEvalOpen();
  };

  const handleConfirmEvaluation = (averageScore) => {
    const updatedList = candidates.map(c => 
      c.id === selectedCandidate.id ? { ...c, status: "generated" } : c
    );
    setCandidates(updatedList);
    
    toast({
      title: "Documento Gerado",
      description: "A avaliação foi gerada. Agora baixe, assine e anexe o documento.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    onEvalClose();
  };

  const handleDownloadPDF = (candidate) => {
    toast({
      title: "Download Iniciado",
      description: `Baixando avaliação de ${candidate.name}...`,
      status: "info",
      duration: 2000,
    });
  };

  const handleOpenUpload = (candidate) => {
    setSelectedCandidate(candidate);
    onUploadOpen();
  };

  const handleConfirmUpload = (file) => {
    const updatedList = candidates.map(c => 
      c.id === selectedCandidate.id ? { ...c, status: "completed" } : c
    );
    setCandidates(updatedList);

    toast({
      title: "Sucesso!",
      description: "Avaliação assinada anexada com sucesso.",
      status: "success",
      duration: 4000,
    });
    
    onUploadClose();
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" shadow="sm">
      <HStack mb={5} justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">Avaliações de Estágio (FCT)</Text>
      </HStack>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Aluno</Th>
            <Th>Escola / Curso</Th>
            <Th>Status</Th>
            <Th textAlign="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {candidates.map((candidate) => (
            <Tr key={candidate.id}>
              <Td fontWeight="medium">{candidate.name}</Td>
              <Td>
                <VStack align="start" spacing={0}>
                    <Text fontSize="sm">{candidate.school}</Text>
                    <Text fontSize="xs" color="gray.500">{candidate.course}</Text>
                </VStack>
              </Td>
              <Td>
                {candidate.status === "pending" && (
                  <Tag colorScheme="yellow">Pendente</Tag>
                )}
                {candidate.status === "generated" && (
                  <Tag colorScheme="blue">Aguardando Upload</Tag>
                )}
                {candidate.status === "completed" && (
                  <Tag colorScheme="green">Concluído</Tag>
                )}
              </Td>
              <Td textAlign="right">
                <HStack justifyContent="flex-end">
                  
                  {candidate.status === "pending" && (
                    <Button 
                      leftIcon={<MdAssignment />} 
                      colorScheme="blue" 
                      size="sm"
                      onClick={() => handleOpenEvaluation(candidate)}
                    >
                      Avaliar
                    </Button>
                  )}

                  {candidate.status === "generated" && (
                    <>
                      <Tooltip label="Baixar PDF Gerado">
                        <IconButton
                          icon={<MdFileDownload />}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(candidate)}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Anexar Avaliação Assinada">
                        <Button
                          leftIcon={<MdUploadFile />}
                          colorScheme="orange"
                          size="sm"
                          onClick={() => handleOpenUpload(candidate)}
                        >
                          Anexar
                        </Button>
                      </Tooltip>
                    </>
                  )}

                  {candidate.status === "completed" && (
                    <Button 
                        leftIcon={<MdPictureAsPdf />} 
                        variant="ghost" 
                        size="sm"
                        isDisabled
                    >
                        Ver Documento
                    </Button>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedCandidate && (
        <EvaluationFormModal 
            isOpen={isEvalOpen} 
            onClose={onEvalClose} 
            candidate={selectedCandidate}
            onConfirm={handleConfirmEvaluation}
        />
      )}

      <UploadSignedModal 
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onConfirm={handleConfirmUpload}
      />

    </Box>
  );
};

export default AvaliacaoFCTEmpresa;
