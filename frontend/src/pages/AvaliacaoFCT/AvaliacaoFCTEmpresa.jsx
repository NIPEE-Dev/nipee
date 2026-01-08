import React, { useState, useEffect, useCallback } from "react";
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
  Spinner,
  Center
} from "@chakra-ui/react";
import {
  MdAssignment,
  MdFileDownload,
  MdUploadFile,
} from "react-icons/md";
import useFctEvaluation from "../../hooks/useFctEvaluation";
import apiex from "../../apiex";

const EVALUATION_FIELDS = [
  { key: "qualityAndOrganization", label: "Qualidade e organização de Trabalho" },
  { key: "integrationAndAdaptation", label: "Integração e Adaptação ao Contexto de Trabalho" },
  { key: "effortAndInterest", label: "Empenho e interesse nas funções desempenhadas" },
  { key: "learningCapacity", label: "Capacidade de Aprendizagem no trabalho" },
  { key: "teamWorkCapacity", label: "Capacidade de Trabalhar em Equipa" },
  { key: "initiative", label: "Espírito de Iniciativa" },
  { key: "workQuality", label: "Qualidade do Trabalho realizado" },
  { key: "workRhythm", label: "Ritmo de Trabalho" },
  { key: "comunication", label: "Comunicação" },
  { key: "securityNorms", label: "Aplicações das normas de segurança" },
  { key: "pontuality", label: "Assiduidade e pontualidade" },
  { key: "personalPresentation", label: "Apresentação pessoal" },
  { key: "interpersonalRelationship", label: "Relacionamento interpessoal" },
  { key: "companyCulture", label: "Apropriação da cultura da empresa" },
  { key: "autonomy", label: "Autonomia" },
  { key: "relationshipWithManagement", label: "Relacionamento com a chefia" },
];

const EVALUATION_STATUS = {
  PENDING: 1,
  WAITING_UPLOAD: 2,
  CONCLUDED: 3
};

const EvaluationFormModal = ({ isOpen, onClose, evaluation, onConfirm, isSubmitting }) => {
  const [scores, setScores] = useState(
    EVALUATION_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: 0 }), {})
  );

  const handleScoreChange = (key, value) => {
    setScores((prev) => ({
      ...prev,
      [key]: parseInt(value) || 0,
    }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const finalAverage = (totalScore / EVALUATION_FIELDS.length).toFixed(2);

  const getClassificationLabel = (val) => {
    if (val < 7) return "Muito Insuficiente";
    if (val < 10) return "Insuficiente";
    if (val < 14) return "Suficiente";
    if (val < 18) return "Bom";
    return "Muito Bom";
  };

  const handleConfirm = () => {
    const payload = {
        ...scores,
        totalPontuation: totalScore,
        final_average: finalAverage,
        classification: getClassificationLabel(finalAverage)
    };
    onConfirm(evaluation.id, payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Avaliação Final - {evaluation?.candidate?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.500">
              Preencha as classificações de 0 a 20. A média será calculada automaticamente.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {EVALUATION_FIELDS.map((field, index) => {
                return (
                  <FormControl key={field.key} display="flex" justifyContent="space-between" alignItems="center">
                    <FormLabel fontSize="sm" mb={0} maxW="70%">
                      {index + 1}. {field.label}
                    </FormLabel>
                    <NumberInput
                      size="sm"
                      maxW="80px"
                      min={0}
                      max={20}
                      value={scores[field.key]}
                      onChange={(val) => handleScoreChange(field.key, val)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                );
              })}
            </SimpleGrid>

            <Divider />

            <HStack justifyContent="space-between" bg="gray.50" p={4} borderRadius="md">
              <VStack align="flex-start" spacing={0}>
                <Text fontWeight="bold">Classificação Final</Text>
                <Text fontSize="xs">(Média Simples)</Text>
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
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleConfirm} isLoading={isSubmitting}>
            Gerar Documento PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UploadSignedModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
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
              Baixe o documento gerado, assine-o e anexe o PDF final aqui.
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
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            colorScheme="orange"
            isDisabled={!file}
            isLoading={isSubmitting}
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
  const { 
    evaluations, 
    fetchEvaluations, 
    submitEvaluationData, 
    uploadEvaluation, 
    loading, 
    error 
  } = useFctEvaluation();

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isCandidato = userRole === "Candidato";
  const isEscola = userRole === "Escola";
  const isEmpresa = userRole === "Empresa";

  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { isOpen: isEvalOpen, onOpen: onEvalOpen, onClose: onEvalClose } = useDisclosure();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const handleOpenEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    onEvalOpen();
  };

  const handleConfirmEvaluation = async (id, data) => {
    setActionLoading(true);
    try {
        await submitEvaluationData(id, data);
        toast({ title: "Documento Gerado", status: "success" });
        onEvalClose();
        fetchEvaluations();
    } catch (err) {
        toast({ title: "Erro", status: "error" });
    } finally {
        setActionLoading(false);
    }
  };

  const handleDownloadPDF = (evaluation) => {
    if (!evaluation.file_path) {
      toast({ status: 'warning', title: 'Arquivo indisponível' });
      return;
    }

    const fileUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/storage${evaluation.file_path}`;

    window.open(fileUrl, '_blank');
  };

  const handleOpenUpload = (evaluation) => {
    setSelectedEvaluation(evaluation);
    onUploadOpen();
  };

  const handleConfirmUpload = async (file) => {
    if (!selectedEvaluation) return;
    setActionLoading(true);
    try {
        await uploadEvaluation(selectedEvaluation.id, file);
        toast({ title: "Sucesso!", status: "success" });
        onUploadClose();
        fetchEvaluations(); 
    } catch (err) {
        toast({ title: "Erro", status: "error" });
    } finally {
        setActionLoading(false);
    }
  };

  const renderStatus = (status) => {
      switch (status) {
          case EVALUATION_STATUS.PENDING: return <Tag colorScheme="yellow">Pendente</Tag>;
          case EVALUATION_STATUS.WAITING_UPLOAD: return <Tag colorScheme="blue">Aguardando Upload</Tag>;
          case EVALUATION_STATUS.CONCLUDED: return <Tag colorScheme="green">Concluído</Tag>;
          default: return <Tag colorScheme="gray">Desconhecido</Tag>;
      }
  };

  if (loading && evaluations.length === 0) {
      return (
          <Center p={10}><Spinner size="xl" color="blue.500" /></Center>
      );
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" shadow="sm">
      <HStack mb={5} justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">Avaliações de FCT</Text>
        <Button size="sm" onClick={fetchEvaluations} isLoading={loading}>Atualizar Lista</Button>
      </HStack>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Aluno</Th>
            <Th>Escola / Cargo</Th>
            <Th>Status</Th>
            <Th textAlign="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {evaluations.map((evaluation) => (
            <Tr key={evaluation.id}>
              <Td fontWeight="medium">{evaluation.candidate || 'N/A'}</Td>
              <Td>
                <VStack align="start" spacing={0}>
                    <Text fontSize="sm">{evaluation.school || 'Escola N/A'}</Text>
                    <Text fontSize="xs" color="gray.500">{evaluation.role || 'Cargo N/A'}</Text>
                </VStack>
              </Td>
              <Td>{renderStatus(evaluation.status)}</Td>
              <Td textAlign="right">
                <HStack justifyContent="flex-end">
                  
                  {evaluation.status === EVALUATION_STATUS.PENDING && isEmpresa && (
                    <Button 
                      leftIcon={<MdAssignment />} 
                      colorScheme="blue" 
                      size="sm"
                      onClick={() => handleOpenEvaluation(evaluation)}
                    >
                      Avaliar
                    </Button>
                  )}

                  {evaluation.status === EVALUATION_STATUS.WAITING_UPLOAD && (
                    <>
                      <Tooltip label="Baixar PDF Gerado">
                        <IconButton
                          icon={<MdFileDownload />}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(evaluation)}
                          aria-label="Download"
                        />
                      </Tooltip>
                      
                      {!isCandidato && (
                        <Tooltip label="Anexar Avaliação Assinada">
                          <Button
                            leftIcon={<MdUploadFile />}
                            colorScheme="orange"
                            size="sm"
                            onClick={() => handleOpenUpload(evaluation)}
                          >
                            Anexar
                          </Button>
                        </Tooltip>
                      )}
                    </>
                  )}

                  {evaluation.status === EVALUATION_STATUS.CONCLUDED && (
                    <Tooltip label="Ver Documento Final">
                        <IconButton
                            icon={<MdFileDownload />}
                            variant="ghost"
                            size="md"
                            colorScheme="blue"
                            onClick={() => handleDownloadPDF(evaluation)}
                            aria-label="Ver Documento"
                        />
                    </Tooltip>
                  )}

                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedEvaluation && (
        <EvaluationFormModal 
            isOpen={isEvalOpen} 
            onClose={onEvalClose} 
            evaluation={selectedEvaluation}
            onConfirm={handleConfirmEvaluation}
            isSubmitting={actionLoading}
        />
      )}
      <UploadSignedModal 
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onConfirm={handleConfirmUpload}
        isSubmitting={actionLoading}
      />
    </Box>
  );
};

export default AvaliacaoFCTEmpresa;