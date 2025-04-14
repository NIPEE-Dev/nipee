import React from "react";
import {
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import {
  MdUploadFile,
  MdDriveFileMoveOutline,
  MdOutlineDriveFileMoveRtl,
} from "react-icons/md";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import routes from "../../routes";

const DashboardCompanies = () => {
  return (
    <ResourceScreen
      title="Relatórios"
      permissions={[""]}
      resource="ReportsCandidates"
      routeBase={routes.reports.candidates}
      canAdd={false}
      canView={false}
      canEdit={false}
      canRemove={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[
  
        {
          field: "courseTitle",
          header: "Curso",
        },
        {
          field: "startContractDate",
          header: "Data de Início",
          type: "date-range",
        },
        {
          field: "endContractDate",
          header: "Data de Término",
          type: "date-range",
        },
        {
          field: "status",
          header: "Status",
          type: "select",
          options: [
            { value: "0", header: "Cancelado" },
            { value: "1", header: "Ativo" },
            { value: "2", header: "Concluido" },
          ],
          serverType: "equals",
        },
        
      ]}
      columns={[
        {
          Header: "Nome do Candidato",
          accessor: "name",
        },
        {
          Header: "Curso",
          accessor: "courseTitle",
        },
        {
          Header: "Data de Início",
          accessor: "startContractDate",
        },
        {
          Header: "Data de Término",
          accessor: "endContractDate",
        },
        {
          Header: "Supervisor da Empresa",
          accessor: "supervisor",
        },
        {
          Header: "Status",
          accessor: (originalData) => {
            const today = new Date();
            const endDate = new Date(
              originalData.endContractDate.split("/").reverse().join("-")
            );

            const isExpired = endDate < today;

            if (isExpired) {
              return (
                <Tag variant="subtle" colorScheme="gray">
                  <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                  <TagLabel>Vencido</TagLabel>
                </Tag>
              );
            }

            const status = [
              <Tag size="md" variant="subtle" colorScheme="red">
                <TagLeftIcon boxSize="12px" as={MdUploadFile} />
                <TagLabel>Cancelado</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="blue">
                <TagLeftIcon boxSize="12px" as={MdDriveFileMoveOutline} />
                <TagLabel>Ativo</TagLabel>
              </Tag>,
              <Tag size="md" variant="subtle" colorScheme="green">
                <TagLeftIcon boxSize="12px" as={MdOutlineDriveFileMoveRtl} />
                <TagLabel>Concluído</TagLabel>
              </Tag>,
            ];

            return status[originalData.status] || null;
          },
        },
        {
          Header: "Avaliação do Candidato",
          accessor: (originalRow) => (
            <>
              {originalRow.avaliationFileUrl !== "" && (
                <Link
                  target="_blank"
                  href={`${import.meta.env.VITE_BACKEND_BASE_URL}${originalRow.avaliationFileUrl}`}
                >
                  {
                    originalRow.avaliationFileUrl.split("/")[
                      originalRow.avaliationFileUrl.split("/").length - 2
                    ]
                  }
                </Link>
              )}
            </>
          ),
        },
        {
          Header: "Contrato",
          accessor: (originalRow) => (
            <>
              {originalRow.contractFilename !== "" && (
                <Link
                  target="_blank"
                  href={`${import.meta.env.VITE_BACKEND_BASE_URL}${originalRow.contractFilename}`}
                >
                  {
                    originalRow.contractFilename.split("/")[
                      originalRow.contractFilename.split("/").length - 2
                    ]
                  }
                </Link>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default DashboardCompanies;
