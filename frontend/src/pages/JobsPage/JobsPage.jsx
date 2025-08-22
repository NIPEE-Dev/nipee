import JobsPageCompany from "./JobsPageCompany";
import JobsCandidate from "./JobsCandidate";
import JobsSchool from "./JobsSchool";

const JobsPage = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';

  if (userRole === "Candidato") {
    return <JobsCandidate />;
  }

  if (userRole === "Escola") {
    return <JobsSchool />;
  }

  if (userRole === "Empresa" || "Administrador Geral") {
    return <JobsPageCompany />;
  }

  return <p>Você não tem permissão para acessar essa página.</p>;
};

export default JobsPage;
