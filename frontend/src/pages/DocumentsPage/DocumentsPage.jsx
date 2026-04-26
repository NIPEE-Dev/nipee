import React from "react";
import {
  HStack,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Button,
  useToast,
  Tooltip,
  Checkbox,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdUploadFile,
  MdDriveFileMoveOutline,
  MdOutlineDriveFileMoveRtl,
  MdEdit,
  MdFileDownload,
  MdRestore,
  MdAdd,
} from "react-icons/md";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import routes from "../../routes";
import { dateFormatter } from "../../utils/visualization";
import getRoute from "../../utils/getRoute";
import WithModal from "../../components/WithModal/WithModal";
import SignaturePad from "../../components/SignaturePad/SignaturePad";
import useUploadSignature from "../../hooks/useUploadSignature";
import api from "../../api";

const initialAddDocumentForm = {
  candidateId: "",
  file: null,
};

const AddDocumentModal = ({ isOpen, onClose, onSuccess }) => {
  const userProfile = JSON.parse(localStorage.getItem("profile") || "null");
  const userRole = userProfile?.role || "";
  const isEmpresa = userRole === "Empresa";
  const isUnidade = userRole === "Unidade" || userRole === "Unidade/Setor";
  const isSetor = userRole === "Setor";
  const isCompanyScope = isEmpresa || isUnidade || isSetor;
  const [formValues, setFormValues] = React.useState(initialAddDocumentForm);
  const [candidates, setCandidates] = React.useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    if (!isOpen) {
      setFormValues(initialAddDocumentForm);
      return;
    }

    const fetchCandidates = async () => {
      setIsLoadingCandidates(true);

      try {
        const response = isCompanyScope
          ? await api.get("/candidates/feedback")
          : await api.get("/candidates", {
              params: {
                perPage: 9999,
              },
            });

        const rawCandidates = response?.data?.data || [];
        const normalizedCandidates = rawCandidates
          .map((item) => {
            if (item?.candidate?.id) {
              return {
                id: item.candidate.id,
                name: item.candidate.name,
                cpf: item.candidate.nif,
              };
            }

            return {
              id: item?.id,
              name: item?.name,
              cpf: item?.cpf,
            };
          })
          .filter((candidate) => candidate?.id && candidate?.name);

        const uniqueCandidates = normalizedCandidates.filter(
          (candidate, index, list) =>
            list.findIndex((item) => item.id === candidate.id) === index,
        );

        setCandidates(uniqueCandidates);
      } catch (error) {
        toast({
          title: "Erro ao carregar alunos",
          description:
            error.response?.data?.message ||
            error.message ||
            "Não foi possível carregar a lista de alunos.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingCandidates(false);
      }
    };

    fetchCandidates();
  }, [isOpen, toast, isCompanyScope]);

  const handleChange = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formValues.candidateId || !formValues.file) {
      toast({
        title: "Atenção",
        description: "Selecione o aluno e anexe o documento.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", formValues.file);
      formData.append("type", "Documento Empresa");

      await api.post(`/candidates/${formValues.candidateId}/document`, formData);

      toast({
        title: "Documento adicionado",
        description: "O documento foi enviado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro ao enviar documento",
        description:
          error.response?.data?.message ||
          error.message ||
          "Não foi possível enviar o documento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar documento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Aluno</FormLabel>
              <Select
                placeholder={
                  isLoadingCandidates ? "Carregando alunos..." : "Selecione o aluno"
                }
                value={formValues.candidateId}
                onChange={(event) => handleChange("candidateId", event.target.value)}
                isDisabled={isLoadingCandidates}
              >
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                    {candidate.cpf ? ` - ${candidate.cpf}` : ""}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Documento</FormLabel>
              <Input
                type="file"
                onChange={(event) => handleChange("file", event.target.files?.[0] || null)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<MdAdd />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ResetFlowModal = ({ documentId, toggleModal, refreshData }) => {
  const { restartContract, loading: isLoading } = useUploadSignature();
  const toast = useToast();

  const handleReset = async () => {
    try {
      await restartContract(documentId);

      toast({
        title: "Fluxo Reiniciado",
        description: "O status do documento voltou para o início.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      refreshData();
      toggleModal();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Erro ao reiniciar fluxo:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível reiniciar o fluxo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text>
        Tem certeza que deseja <b>reiniciar o fluxo de assinatura</b>?
      </Text>
      <Text fontSize="sm" color="red.500">
        Isso descartará qualquer assinatura ou arquivo enviado até o momento e o status voltará para o inicial. Use esta opção se o arquivo enviado estiver incorreto ou o formato da assinatura não for aceito.
      </Text>
      <HStack justifyContent="flex-end" pt={4}>
        <Button variant="ghost" onClick={toggleModal} isDisabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          colorScheme="red" 
          onClick={handleReset} 
          isLoading={isLoading}
          leftIcon={<MdRestore />}
        >
          Confirmar Reinício
        </Button>
      </HStack>
    </VStack>
  );
};

const UploadDocumentModal = ({ documentId, toggleModal, refreshData, requiresAcceptance }) => {
  const [file, setFile] = React.useState(null);
  const [accepted, setAccepted] = React.useState(!requiresAcceptance);
  
  const { uploadSignedFile, loading: isLoading } = useUploadSignature();
  const toast = useToast();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Atenção",
        description: "Selecione um arquivo para enviar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (requiresAcceptance && !accepted) {
        toast({
          title: "Atenção",
          description: "Você precisa confirmar que leu e está de acordo.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
    }

    try {
      await uploadSignedFile(documentId, file);

      toast({
        title: "Sucesso",
        description: "Documento anexado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refreshData();
      toggleModal();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      toast({
        title: "Erro no Upload",
        description: error.message || "Ocorreu uma falha ao anexar o documento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack p={4} spacing={4} alignItems="stretch">
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      
      {requiresAcceptance && (
          <Checkbox 
            isChecked={accepted} 
            onChange={(e) => setAccepted(e.target.checked)}
            colorScheme="orange"
          >
            <Text fontSize="sm">
                Li o documento, confirmei as assinaturas e estou de acordo.
            </Text>
          </Checkbox>
      )}

      <HStack justifyContent="flex-end">
        <Button
          colorScheme="orange"
          onClick={handleUpload}
          isLoading={isLoading}
          isDisabled={!file || (requiresAcceptance && !accepted)}
          leftIcon={<MdUploadFile />}
        >
          Submeter para assinatura
        </Button>
      </HStack>
    </VStack>
  );
};

const DocumentsPage = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile"));
  const userRole = userProfile?.role || "";
  const isEscola = userRole === "Escola";
  const isEmpresa = userRole === "Empresa";
  const isUnidade = userRole === "Unidade" || userRole === "Unidade/Setor";
  const isSetor = userRole === "Setor";
  const isCompanyScope = isEmpresa || isUnidade || isSetor;
  const isAdm = userRole === "Administrador Geral";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resourceScreenRef = React.useRef();
  const refreshData = () => {
    if (resourceScreenRef.current && resourceScreenRef.current.refresh) {
      resourceScreenRef.current.refresh();
    }
  };

  const handleDocumentAdded = () => {
    refreshData();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <ResourceScreen
        ref={resourceScreenRef}
        title="Documentos"
        permissions={[""]}
        resource="Documents"
        routeBase={routes.documents}
        canAdd={false}
        canView={false}
        canEdit={false}
        canRemove={isAdm}
        resourceListProps={{
          downloadButtonEnabled: false,
          headerActions: (isAdm || isCompanyScope) && (
            <Button colorScheme="teal" leftIcon={<MdAdd />} onClick={onOpen}>
              Adicionar documento
            </Button>
          ),
        }}
        filters={[
        {
            field: "nif",
            header: "NIF",
            type: "text",
        },
        {
          field: "status",
          header: "Status",
          type: "select",
          options: [
            { value: "0", header: "Gerado" },
            { value: "1", header: "Enviado" },
            { value: "2", header: "Devolvido" },
            { value: "3", header: "Aguardando assinatura Empresa" },
            { value: "4", header: "Aguardando assinatura Escola" },
            { value: "5", header: "Assinado" },
          ],
          serverType: "equals",
        },
        {
            field: "created_at",
            header: "Criado em",
            type: "date-range",
        },
        ]}
        columns={[
        ...(isEscola || isCompanyScope
          ? [
              {
                Header: "Ação",
                accessor: "sign_or_upload",
                Cell: ({ row }) => {
                  const {
                    status,
                    attachable,
                    type,
                    id: documentId,
                    filename,
                    file_extension
                  } = row.original;
                  const attachableId = row.original.attachable_id;

                  const tiposComAcao = [
                    "Contrato",
                    "Protocolo",
                    "Protocolo Manual",
                  ];

                  if (!tiposComAcao.includes(type)) return null;
                  if (status === "5") return null;

                  const isProtocoloManual = type === "Protocolo Manual";
                  const isProtocoloAutomatico = type === "Protocolo";

                  let showUploadFlow = false;

                  if (isProtocoloManual && isEscola && status !== "1") {
                    showUploadFlow = true;
                  }

                  if (isProtocoloAutomatico) {
                    if (isCompanyScope && status === "3") showUploadFlow = true;
                    if (isEscola && status === "4") showUploadFlow = true;
                  }

                  if (showUploadFlow) {
                    const downloadUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/documents/${filename}.${file_extension}/download`;

                    return (
                        <HStack spacing={2}>
                            <Tooltip label="Download" hasArrow>
                                <Link href={downloadUrl} target="_blank" _hover={{ textDecoration: 'none' }}>
                                    <Button size="xs" colorScheme="blue">
                                        <MdFileDownload />
                                    </Button>
                                </Link>
                            </Tooltip>

                            <WithModal
                                title={isProtocoloAutomatico ? "Anexar Protocolo Assinado" : "Anexar Protocolo Manual"}
                                modal={({ toggleModal: innerToggleModal }) => (
                                <UploadDocumentModal
                                    documentId={documentId}
                                    toggleModal={innerToggleModal}
                                    refreshData={refreshData}
                                    requiresAcceptance={isProtocoloAutomatico} 
                                />
                                )}
                                size="xl"
                            >
                                {({ toggleModal }) => (
                                <Tooltip label="Anexar" hasArrow>
                                    <Button
                                    colorScheme="orange"
                                    size="xs"
                                    onClick={toggleModal}
                                    >
                                    <MdUploadFile />
                                    </Button>
                                </Tooltip>
                                )}
                            </WithModal>

                            {isProtocoloAutomatico && (
                                <WithModal
                                    title="Reiniciar Fluxo"
                                    modal={({ toggleModal: innerToggleModal }) => (
                                        <ResetFlowModal 
                                            documentId={documentId}
                                            toggleModal={innerToggleModal}
                                            refreshData={refreshData}
                                        />
                                    )}
                                >
                                    {({ toggleModal }) => (
                                        <Tooltip label="Recusar/Reiniciar Fluxo" hasArrow>
                                            <Button
                                                colorScheme="red"
                                                variant="outline"
                                                size="xs"
                                                onClick={toggleModal}
                                            >
                                                <MdRestore />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </WithModal>
                            )}
                        </HStack>
                    );
                  }

                  const isAssinavelDigital = ["Contrato"].includes(type);

                  if (isAssinavelDigital) {
                    let canSign = false;

                    if (isCompanyScope && status === "3" && attachable.company_signature === 0) {
                        canSign = true;
                    }
                    if (isEscola && status === "4" && attachable.school_signature === 0) {
                        canSign = true;
                    }

                    if (canSign) {
                      return (
                        <WithModal
                          title="Assinar Documento"
                          modal={<SignaturePad documentId={attachableId} />}
                          size="xl"
                        >
                          {({ toggleModal }) => (
                            <Tooltip label="Assinar Digitalmente" hasArrow>
                              <Button
                                colorScheme="blue"
                                size="xs"
                                onClick={toggleModal}
                              >
                                <MdEdit />
                              </Button>
                            </Tooltip>
                          )}
                        </WithModal>
                      );
                    }
                  }

                  return null;
                },
              },
            ]
          : []),
        {
          Header: "Tipo",
          accessor: (originalData) => {
            const availableNames = {
              Candidate: {
                name: "Candidato",
                url: getRoute(routes.candidates.edit, {
                  id: originalData.attachable_id,
                }),
              },
              School: {
                name: "Escola",
                url: getRoute(routes.schools.edit, {
                  id: originalData.attachable_id,
                }),
              },
              Company: {
                name: "Empresa",
                url: getRoute(routes.companies.edit, {
                  id: originalData.attachable_id,
                }),
              },
              Contract: {
                name: "Protocolo",
                url: getRoute(routes.contracts.edit, {
                  id: originalData.attachable_id,
                }),
              },
              Job: {
                name: "Vaga",
                url: getRoute(routes.jobs.edit, {
                  id: originalData.attachable_id,
                }),
              },
            };

            const matchType = availableNames[originalData.name];
            return matchType.name;
          },
        },
        {
          Header: "Nome",
          accessor: (originalData) => {
            const availableNames = {
              Candidate: originalData.attachable?.name,
              School: originalData.attachable?.corporate_name,
              Company: originalData.attachable?.corporate_name,
              Contract: originalData.attachable?.candidate?.name,
              Job: originalData.attachable?.company?.corporate_name,
            };

            return availableNames[originalData.name] || "";
          },
        },
        {
          Header: "NIF",
          accessor: (originalData) => {
            if (originalData.name === "Candidate") {
              return originalData.attachable?.cpf || "";
            }
          },
        },
        {
          Header: "Ficheiro",
          accessor: (originalRow) => (
            <Link
              target="_blank"
              href={`${import.meta.env.VITE_BACKEND_BASE_URL}/documents/${
                originalRow.filename
              }.${originalRow.file_extension}/download`}
            >
              {originalRow.original_filename}.{originalRow.file_extension}
            </Link>
          ),
        },
        {
          Header: "Status",
          accessor: (originalData) => {
            const status = [
              <Tag size="md" variant="subtle" colorScheme="cyan">
                <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                <TagLabel>Gerado</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="purple">
                <TagLeftIcon boxSize="12px" as={MdDriveFileMoveOutline} />
                <TagLabel>Enviado</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="green">
                <TagLeftIcon boxSize="12px" as={MdOutlineDriveFileMoveRtl} />
                <TagLabel>Devolvido</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="cyan">
                <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                <TagLabel>Aguardando assinatura Empresa</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="cyan">
                <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                <TagLabel>Aguardando assinatura Escola</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="green">
                <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                <TagLabel>Assinado</TagLabel>
              </Tag>,
            ];

            return status[originalData.status];
          },
        },
        {
          Header: "Criado em",
          accessor: (originalData) =>
            dateFormatter(
              originalData.created_at,
              "DD/MM/YYYY HH:mm:ss",
              "YYYY-MM-DDTHH:mm:ss.SSSSSSz"
            ),
        },
        {
          Header: "Atualizado em",
          accessor: (originalData) =>
            dateFormatter(
              originalData.updated_at,
              "DD/MM/YYYY HH:mm:ss",
              "YYYY-MM-DDTHH:mm:ss.SSSSSSz"
            ),
        },
        ]}
      />

      <AddDocumentModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleDocumentAdded}
      />
    </>
  );
};

export default DocumentsPage;
