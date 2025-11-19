import AvaliacaoFCTEmpresa from "./AvaliacaoFCTEmpresa";
import AvaliacaoFCTEscola from "./AvaliacaoFCTEscola";
import AvaliacaoFCTAluno from "./AvaliacaoFCTAluno";

const AvaliacaoFCT = () => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';

  if (userRole === "Candidato") {
    return <AvaliacaoFCTAluno />;
  }

  if (userRole === "Empresa") {
    return <AvaliacaoFCTEmpresa />;
  }

  if (userRole === "Escola") {
    return <AvaliacaoFCTEscola />;
  }

  return <p>Você não tem permissão para acessar essa página.</p>;
};

export default AvaliacaoFCT;
