import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Divider,
  Container,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import logo from "/src/images/logo.png";

const PoliticaPrivacidade = () => {
  return (
    <Box bg="white" minH="100vh" py={10} px={{ base: 4, md: 8 }}>
      <Container maxW="800px">
        <VStack spacing={6} align="stretch">
          
          <Box textAlign="center" mb={4}>
            <img src={logo} alt="Logo NIPEE" style={{ width: "200px", margin: "0 auto" }} />
            <Heading as="h1" size="lg" mt={4}>
              POLÍTICA DE PRIVACIDADE
            </Heading>
            <Text fontWeight="bold">Plataforma NIPEE</Text>
            <Text fontSize="sm">Última atualização: 23/02/2026</Text>
          </Box>

          <Divider />

          {/* 1. Identificação */}
          <Box>
            <Heading as="h2" size="md" mb={2}>1. Identificação do Responsável pelo Tratamento</Heading>
            <Text>A plataforma NIPEE é operada por: <strong>KUKYDOMAIN – UNIPESSOAL LDA</strong>,</Text>
            <Text>NIPC: 518719936</Text>
            <Text>Sede: Rua Fernando Pessoa, nº 61, 4º Esquerdo – São João do Estoril – 2765-483 Estoril</Text>
            <Text>Email: <Link href="mailto:contacto@nipee.org" color="blue.500">contacto@nipee.org</Link></Text>
            <Text mt={2}>A NIPEE trata os dados pessoais dos seus utilizadores nos termos do Regulamento (UE) 2016/679 (RGPD) e legislação nacional aplicável.</Text>
          </Box>

          {/* 2. Âmbito */}
          <Box>
            <Heading as="h2" size="md" mb={2}>2. Âmbito de Aplicação</Heading>
            <Text>A presente Política aplica-se a:</Text>
            <UnorderedList mt={2} spacing={1} pl={5}>
              <ListItem>Alunos e candidatos (incluindo menores de idade)</ListItem>
              <ListItem>Empresas registadas</ListItem>
              <ListItem>Municípios e entidades públicas parceiras</ListItem>
              <ListItem>Visitantes do website</ListItem>
            </UnorderedList>
          </Box>

          {/* 3. Categorias de Dados */}
          <Box>
            <Heading as="h2" size="md" mb={2}>3. Categorias de Dados Pessoais Tratados</Heading>
            <VStack align="stretch" spacing={3} mt={2}>
              <Box>
                <Text fontWeight="bold">3.1 Dados de Identificação</Text>
                <Text fontSize="sm">Nome completo, data de nascimento e número de identificação (quando necessário).</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">3.2 Dados de Contacto</Text>
                <Text fontSize="sm">Email, número de telefone e morada.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">3.3 Dados Académicos e Profissionais</Text>
                <Text fontSize="sm">Escola/instituição, curso, curriculum vitae, histórico de candidaturas e experiência profissional.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">3.4 Dados Empresariais</Text>
                <Text fontSize="sm">Denominação social, NIPC, nome do representante e contactos institucionais.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">3.5 Dados Técnicos</Text>
                <Text fontSize="sm">Endereço IP, logs de acesso, dados de navegação e cookies.</Text>
              </Box>
            </VStack>
          </Box>

          {/* 4. Finalidades */}
          <Box>
            <Heading as="h2" size="md" mb={2}>4. Finalidades do Tratamento</Heading>
            <Text>Os dados pessoais são tratados para:</Text>
            <UnorderedList pl={5}>
              <ListItem>Registo e gestão de contas;</ListItem>
              <ListItem>Intermediação entre alunos, empresas e escolas;</ListItem>
              <ListItem>Processos de candidatura e recrutamento;</ListItem>
              <ListItem>Execução de protocolos com entidades públicas;</ListItem>
              <ListItem>Comunicação institucional e cumprimento de obrigações legais;</ListItem>
              <ListItem>Segurança e melhoria da plataforma.</ListItem>
            </UnorderedList>
          </Box>

          {/* 5. Fundamento Jurídico */}
          <Box>
            <Heading as="h2" size="md" mb={2}>5. Fundamento Jurídico</Heading>
            <Text>O tratamento baseia-se em: Consentimento do titular, execução de contrato, cumprimento de obrigação legal, interesse legítimo da NIPEE (segurança) e interesse público (protocolos oficiais).</Text>
          </Box>

          {/* 6. Dados de Menores */}
          <Box>
            <Heading as="h2" size="md" mb={2}>6. Tratamento de Dados de Menores</Heading>
            <Text>Para utilizadores com menos de 16 anos, o tratamento depende do consentimento do responsável legal. Os dados serão utilizados exclusivamente para finalidades de formação e empregabilidade.</Text>
          </Box>

          {/* 7. Partilha de Dados */}
          <Box>
            <Heading as="h2" size="md" mb={2}>7. Partilha de Dados</Heading>
            <Text>Os dados poderão ser partilhados com empresas registadas, estabelecimentos de ensino, municípios, entidades públicas e prestadores de serviços tecnológicos. As empresas que recebem dados tornam-se responsáveis autónomas pelo tratamento posterior.</Text>
          </Box>

          {/* 8. Conservação */}
          <Box>
            <Heading as="h2" size="md" mb={2}>8. Conservação dos Dados</Heading>
            <Text>Os dados serão conservados enquanto a conta estiver ativa, até 2 anos após a última interação, ou pelo prazo legal exigido. Após este período, serão eliminados ou anonimizados.</Text>
          </Box>

          {/* 9. Direitos */}
          <Box>
            <Heading as="h2" size="md" mb={2}>9. Direitos dos Titulares</Heading>
            <Text>O titular tem direito ao acesso, retificação, apagamento (esquecimento), limitação, oposição e portabilidade dos dados, além da retirada de consentimento.</Text>
            <Text mt={2} fontWeight="bold">Contacto para exercício de direitos: contacto@nipee.org</Text>
            <Text mt={2}>Reclamações podem ser enviadas à Comissão Nacional de Proteção de Dados (CNPD) – Portugal.</Text>
          </Box>

          {/* 10. Transferências */}
          <Box>
            <Heading as="h2" size="md" mb={2}>10. Transferências Internacionais</Heading>
            <Text>Caso os dados sejam tratados fora do EEE, a NIPEE assegurará decisões de adequação ou cláusulas contratuais-tipo aprovadas pela Comissão Europeia.</Text>
          </Box>

          {/* 11. Segurança */}
          <Box>
            <Heading as="h2" size="md" mb={2}>11. Segurança</Heading>
            <Text>Implementamos medidas técnicas para proteger os dados contra acesso não autorizado, perda ou alteração. O acesso é restrito a pessoas autorizadas.</Text>
          </Box>

          {/* 12. Cookies */}
          <Box>
            <Heading as="h2" size="md" mb={2}>12. Cookies</Heading>
            <Text>A NIPEE utiliza cookies essenciais e, quando aplicável, analíticos ou funcionais, conforme a Política de Cookies.</Text>
          </Box>

          {/* 13. Alterações */}
          <Box pb={10}>
            <Heading as="h2" size="md" mb={2}>13. Alterações à Política de Privacidade</Heading>
            <Text>A NIPEE pode atualizar esta Política a qualquer momento. Versões atualizadas estarão sempre disponíveis na plataforma.</Text>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default PoliticaPrivacidade;