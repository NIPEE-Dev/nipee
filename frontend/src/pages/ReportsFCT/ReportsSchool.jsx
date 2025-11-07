import React from "react";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import { CandidatesForm as Form } from "../../forms/CandidatesForm/CandidatesForm";
import { Link } from "@chakra-ui/react";
import routes from "../../routes";

const ReportsSchool = () => {
  const title = "Relatórios FCT";

  return (
    <ResourceScreen
      title={title}
      permissions={[""]}
      resource="ReportsFCT"
      routeBase={routes}
      Form={Form}
      canAdd={false}
      canView={false}
      canRemove={false}
      canEdit={false}
      resourceListProps={{
        downloadButtonEnabled: false,
      }}
      filters={[{ field: "candidateName", header: "Nome" }]}
      columns={[
        {
          Header: "Nome Aluno",
          accessor: "candidateName",
        },
        {
          Header: "Empresa",
          accessor: "companyName",
        },
        {
          Header: "Total de horas",
          accessor: "totalHours",
        },
        {
          Header: "Data de Envio",
          accessor: (originalRow) => {
            const dateString = originalRow.sentDate;
            if (!dateString) return "-";

            const date = new Date(dateString + "T00:00:00");

            if (isNaN(date.getTime())) {
              return "Data inválida";
            }

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
          },
        },
        {
          Header: "Relatório",
          accessor: (originalRow) => {
            const filePath = `${
              import.meta.env.VITE_BACKEND_BASE_URL_EX
            }/storage${originalRow.report}`;

            return (
              <Link target="_blank" href={filePath}>
                Baixar relatório de {originalRow.candidateName}
              </Link>
            );
          },
        },
      ]}
    />
  );
};

export default ReportsSchool;
