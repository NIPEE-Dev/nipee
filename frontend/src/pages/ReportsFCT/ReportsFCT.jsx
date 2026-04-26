import ReportsCandidate from "./ReportsCandidate";
import ReportsCompany from "./ReportsCompany";
import ReportsSchool from "./ReportsSchool";

const ReportsFCT = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';

  if (userRole === "Candidato") {
    return <ReportsCandidate />;
  }

  if (userRole === "Empresa" || userRole === "Unidade" || userRole === "Setor") {
    return <ReportsCompany />;
  }

  if (userRole === "Escola") {
    return <ReportsSchool />;
  }

  return <p>Você não tem permissão para acessar essa página.</p>;
};

export default ReportsFCT;
