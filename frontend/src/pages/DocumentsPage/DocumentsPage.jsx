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
} from "@chakra-ui/react";
import {
  MdUploadFile,
  MdDriveFileMoveOutline,
  MdOutlineDriveFileMoveRtl,
  MdOutlineOpenInNew,
  MdEdit,
} from "react-icons/md";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import routes from "../../routes";
import { dateFormatter } from "../../utils/visualization";
import getRoute from "../../utils/getRoute";
import WithModal from "../../components/WithModal/WithModal";
import SignaturePad from "../../components/SignaturePad/SignaturePad";
import api from "../../api";

const UploadDocumentModal = ({ documentId, toggleModal, refreshData }) => {
  const [file, setFile] = React.useState(null);
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await api.post(`/documents/${documentId}/signed-contract`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Sucesso",
        description: "Protocolo Manual anexado com sucesso!",
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
        description: "Ocorreu uma falha ao anexar o Protocolo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HStack p={4} spacing={4} justifyContent="flex-end">
      <input type="file" onChange={handleFileChange} style={{ flexGrow: 1 }} />
      <Button
        colorScheme="orange"
        onClick={handleUpload}
        isLoading={isLoading}
        isDisabled={!file}
        leftIcon={<MdUploadFile />}
      >
        Enviar
      </Button>
    </HStack>
  );
};

const DocumentsPage = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile"));
  const userRole = userProfile?.role || "";
  const isEscola = userRole === "Escola";
  const isEmpresa = userRole === "Empresa";
  const isAdm = userRole === "Administrador Geral";
  const isCandidato = userRole === "Candidato";

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
                  const tiposComAcao = [
                    "Contrato",
                    "Protocolo",
                    "Protocolo Manual",
                  ];
                  const {
                    status,
                    attachable,
                    type,
                    id: documentId,
                  } = row.original;
                  const attachableId = row.original.attachable_id;

                  if (!tiposComAcao.includes(type)) return null;
                  if (status === "5") return null;

                  if (type === "Protocolo Manual" && isEscola) {
                    if (status === "1") return null;

                    return (
                      <WithModal
                        title="Anexar Protocolo Manual"
                        modal={({ toggleModal: innerToggleModal }) => (
                          <UploadDocumentModal
                            documentId={documentId}
                            toggleModal={innerToggleModal}
                            refreshData={refreshData}
                          />
                        )}
                        size="xl"
                      >
                        {({ toggleModal }) => (
                          <Tooltip label="Anexar Protocolo Manual" hasArrow>
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
                    );
                  }

                  const isAssinavelDigital = ["Contrato", "Protocolo"].includes(
                    type
                  );

                  if (isAssinavelDigital) {
                    let canSign = false;

                    if (isEmpresa) {
                      if (
                        status === "3" &&
                        attachable.company_signature === 0
                      ) {
                        canSign = true;
                      }
                    }

                    if (isEscola) {
                      if (status === "4" && attachable.school_signature === 0) {
                        canSign = true;
                      }
                    }

                    if (canSign) {
                      return (
                        <WithModal
                          title="Assinar Documento"
                          modal={<SignaturePad documentId={attachableId} />}
                          size="xl"
                        >
                          {({ toggleModal }) => (
                            <Tooltip label="Assinar" hasArrow>
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
