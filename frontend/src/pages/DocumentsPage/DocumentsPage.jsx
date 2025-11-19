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
  Text
} from "@chakra-ui/react";
import {
  MdUploadFile,
  MdDriveFileMoveOutline,
  MdOutlineDriveFileMoveRtl,
  MdEdit,
  MdFileDownload
} from "react-icons/md";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import routes from "../../routes";
import { dateFormatter } from "../../utils/visualization";
import getRoute from "../../utils/getRoute";
import WithModal from "../../components/WithModal/WithModal";
import SignaturePad from "../../components/SignaturePad/SignaturePad";
import api from "../../api";

const UploadDocumentModal = ({ documentId, toggleModal, refreshData, endpoint, requiresAcceptance }) => {
  const [file, setFile] = React.useState(null);
  const [accepted, setAccepted] = React.useState(!requiresAcceptance);
  const [isLoading, setIsLoading] = React.useState(false);
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
        description: "Ocorreu uma falha ao anexar o documento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
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
          Submeter
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
  const isAdm = userRole === "Administrador Geral";

  const resourceScreenRef = React.useRef();
  const refreshData = () => {
    if (resourceScreenRef.current && resourceScreenRef.current.refresh) {
      resourceScreenRef.current.refresh();
    }
  };

  return (
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
      }}
      filters={[
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
        ...(isEscola || isEmpresa
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
                    if (isEmpresa && status === "3") showUploadFlow = true;
                    if (isEscola && status === "4") showUploadFlow = true;
                  }

                  if (showUploadFlow) {
                    const endpointUpload = isProtocoloManual 
                        ? `/documents/${documentId}/signed-contract`
                        : `/documents/${documentId}/upload-signed-protocol`;
                    const downloadUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/documents/${filename}.${file_extension}/download`;

                    return (
                        <HStack spacing={2}>
                            <Tooltip label="Downloa" hasArrow>
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
                                    endpoint={endpointUpload}
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
                        </HStack>
                    );
                  }

                  const isAssinavelDigital = ["Contrato"].includes(type);

                  if (isAssinavelDigital) {
                    let canSign = false;

                    if (isEmpresa && status === "3" && attachable.company_signature === 0) {
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
  );
};

export default DocumentsPage;
