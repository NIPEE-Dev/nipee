import React, { useEffect, useState } from "react";
import ResourceScreen from "../../components/ResourceScreen/ResourceScreen";
import { CandidatesForm as Form } from "../../forms/CandidatesForm/CandidatesForm";
import { Link, useDisclosure, Button, Icon } from "@chakra-ui/react";
import routes from "../../routes";
import { candidatesCitiesFilters } from "../../utils/filterHelpers";
import { useNavigate } from "react-router-dom";
import { usePublic } from "../../hooks/usePublic";
import { FaHistory } from "react-icons/fa";
import HistoryModal from "./HistoryModal";

const CandidatesPage = () => {
  const navigate = useNavigate();
  const { fetchSchools, schools } = usePublic();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const userProfile = JSON.parse(localStorage.getItem("profile"));
  const userRole = userProfile?.role || "";
  const isEmpresa = userRole === "Empresa";
  const isCandidato = userRole === "Candidato";
  const isEscola = userRole === "Escola";
  const isAdm = userRole === "Administrador Geral";

  const title = isAdm || isEscola || isEmpresa ? "Candidatos" : "Meu Registo";

  useEffect(() => {
    if (isCandidato) {
      navigate(routes.candidates.self);
    }
    fetchSchools();
  }, []);

  const handleOpenHistory = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <>
      <ResourceScreen
        title={title}
        permissions={[""]}
        resource="Candidates"
        routeBase={routes.config.candidates}
        Form={Form}
        canAdd={!(isEmpresa || isCandidato || isEscola)}
        canRemove={!(isEmpresa || isCandidato || isEscola)}
        canEdit={!(isEmpresa || isEscola)}
        resourceListProps={{
          downloadButtonEnabled: false,
        }}
        filters={[
          { field: "name", header: "Nome" },
          {
            field: "gender",
            header: "Género",
            type: "select",
            options: [
              { value: "F", header: "Feminino" },
              { value: "M", header: "Masculino" },
            ],
          },
          {
            field: "course",
            header: "Curso",
            type: "text",
          },
          {
            field: "skills",
            header: "Habilidades",
            type: "text",
          },
          {
            field: "school_id",
            header: "Escola",
            type: "select",
            options: schools.map((element) => ({
              header: element.corporate_name,
              value: element.id,
            })),
          },
          ...candidatesCitiesFilters,
        ]}
        columns={[
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Nome",
            accessor: "name",
          },
          {
            Header: "Currículo",
            accessor: (originalRow) => {
              const filePath = `${
                import.meta.env.VITE_BACKEND_BASE_URL_EX
              }/storage/${originalRow.resume}`;

              return (
                <Link target="_blank" href={filePath}>
                  Currículo de {originalRow.name}
                </Link>
              );
            },
          },
          {
            Header: "Género",
            accessor: "gender_title",
          },
          {
            Header: "Data de nascimento",
            accessor: "birth_day",
          },
          {
            Header: "Curso",
            accessor: "course_title",
          },
          {
            Header: "Localidade",
            accessor: "address.city",
          },
          {
            Header: "Conselho",
            accessor: "address.district",
          },
          {
            Header: "Telemóvel",
            accessor: "contact.phone",
          },
          {
            Header: "Escola",
            accessor: (originalRow) => {
              return originalRow?.user?.school?.[0]?.fantasy_name || "";
            },
          },
          {
            Header: "Período",
            accessor: "period",
            Cell: ({ value }) => {
              switch (value) {
                case "M":
                  return "Manhã";
                case "T":
                  return "Tarde";
                case "N":
                  return "Noite";
                case "MN":
                case "I":
                  return "Integral";
                default:
                  return "Período desconhecido";
              }
            },
          },
          {
            Header: "Histórico FCT",
            id: "history_action",
            accessor: (originalRow) => {
              return (
                <Button
                  leftIcon={<Icon as={FaHistory} />}
                  size="xs"
                  bgGradient="linear(to-r, #5C3BEB, #7084FE)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => handleOpenHistory(originalRow)}
                >
                  Ver Histórico
                </Button>
              );
            },
          },
        ]}
      />

      <HistoryModal
        isOpen={isOpen}
        onClose={onClose}
        studentName={selectedStudent?.name}
      />
    </>
  );
};

export default CandidatesPage;
