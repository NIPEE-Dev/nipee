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

const ActivityReport = () => {
  return (
    <ResourceScreen
      title="Relatório de Atividade do Sistema"
      permissions={[""]}
      resource="ReportsSystemActivity"
      routeBase={routes.config.report}
      canAdd={false}
      canView={false}
      canEdit={false}
      canRemove={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      // filters={[
      //   {
      //     field: "name",
      //     header: "Nome Candidato Estagiário",
      //   },
      //   {
      //     field: "courseTitle",
      //     header: "Curso/Área de Estudo",
      //   },
      //   {
      //     field: "startContractDate",
      //     header: "Data de Início do Estágio",
      //     type: "date-range",
      //   },
      //   {
      //     field: "endContractDate",
      //     header: "Data de Término do Estágio",
      //     type: "date-range",
      //   },
      //   {
      //     field: "status",
      //     header: "Status",
      //     type: "select",
      //     options: [
      //       { value: "0", header: "Cancelado" },
      //       { value: "1", header: "Ativo" },
      //       { value: "2", header: "Concluido" },
      //     ],
      //     serverType: "equals",
      //   },
        
      // ]}
      columns={[
        {
          Header: "Número de Usuários Ativos (Escolas, Empresas, Candidatos)",
          accessor: "users",
        },
        {
          Header: "Número de Estágios Criados",
          accessor: "jobs",
        },
        {
          Header: "Número de Contratos Assinados",
          accessor: "jobCandidates",
        },
        {
          Header: "Número de Candidaturas Submetidas",
          accessor: "contracts",
        },
      ]}
    />
  );
};

export default ActivityReport;
