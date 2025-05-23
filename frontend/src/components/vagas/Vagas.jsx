import React, { useState, useEffect } from 'react';

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  
  // Simulação de uma API de vagas de emprego
  useEffect(() => {
    const fetchVagas = async () => {
      // Simulação de dados de vagas, pode ser substituído por uma API real
      const dadosVagas = [
        { id: 1, titulo: 'Desenvolvedor Front-End', local: 'São Paulo', descricao: 'Desenvolvimento de interfaces em React' },
        { id: 2, titulo: 'Desenvolvedor Back-End', local: 'Rio de Janeiro', descricao: 'Desenvolvimento de APIs em Node.js' },
        { id: 3, titulo: 'Designer UX/UI', local: 'Belo Horizonte', descricao: 'Criação de interfaces e experiências para produtos digitais' },
      ];
      
      setVagas(dadosVagas);
    };
    
    fetchVagas();
  }, []);
  
  return (
    <div className="vagas-container">
      <h1>Vagas de Emprego</h1>
      {vagas.length === 0 ? (
        <p>Carregando vagas...</p>
      ) : (
        <ul>
          {vagas.map(vaga => (
            <li key={vaga.id} className="vaga-item">
              <h2>{vaga.titulo}</h2>
              <p><strong>Local:</strong> {vaga.local}</p>
              <p><strong>Descrição:</strong> {vaga.descricao}</p>
              <button>Aplicar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Vagas;
