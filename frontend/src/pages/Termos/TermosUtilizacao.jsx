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
import { Link as RouterLink } from "react-router-dom";

const TermosUtilizacao = () => {
  return (
    <Box bg="white" minH="100vh" py={10} px={{ base: 4, md: 8 }}>
      <Container maxW="800px">
        <VStack spacing={6} align="stretch">
          
          <Box textAlign="center" mb={4}>
            <img src={logo} alt="Logo NIPEE" style={{ width: "200px", margin: "0 auto" }} />
            <Heading as="h1" size="lg" mt={4}>
              TERMOS E CONDIÇÕES DE UTILIZAÇÃO
            </Heading>
            <Text fontWeight="bold">Plataforma NIPEE</Text>
            <Text fontSize="sm">Última atualização: 23/02/2026</Text>
          </Box>

          <Divider />

          {/* 1. Identificação */}
          <Box>
            <Heading as="h2" size="md" mb={2}>1. Identificação da Entidade</Heading>
            <Text>A plataforma NIPEE é operada por: <strong>KUKYDOMAIN – UNIPESSOAL LDA</strong>,</Text>
            <Text>NIPC: 518719936</Text>
            <Text>Sede: Rua Fernando Pessoa, nº 61, 4º Esquerdo – São João do Estoril – 2765-483 Estoril</Text>
            <Text>Email: <Link href="mailto:contacto@nipee.org" color="blue.500">contacto@nipee.org</Link></Text>
            <Text>Doravante designada por “NIPEE”.</Text>
          </Box>

          {/* 2. Objeto */}
          <Box>
            <Heading as="h2" size="md" mb={2}>2. Objeto</Heading>
            <Text>A NIPEE disponibiliza uma plataforma digital destinada a:</Text>
            <UnorderedList mt={2} spacing={1} pl={5}>
              <ListItem>Conectar alunos, escolas e empresas;</ListItem>
              <ListItem>Facilitar oportunidades de estágio, formação e inserção profissional;</ListItem>
              <ListItem>Apoiar programas de empregabilidade, incluindo parcerias com entidades públicas.</ListItem>
            </UnorderedList>
            <Text mt={2}>A NIPEE atua como intermediadora tecnológica, não sendo parte integrante de qualquer contrato celebrado entre utilizadores.</Text>
          </Box>

          {/* 3. Aceitação */}
          <Box>
            <Heading as="h2" size="md" mb={2}>3. Aceitação dos Termos</Heading>
            <Text>O registo e utilização da plataforma implicam a aceitação integral dos presentes Termos e Condições.</Text>
            <Text>A aceitação é realizada por via eletrónica, mediante seleção de opção expressa.</Text>
          </Box>

          {/* 4. Criação de Conta */}
          <Box>
            <Heading as="h2" size="md" mb={2}>4. Criação de Conta</Heading>
            <Box mb={3}>
              <Text fontWeight="bold">4.1 Alunos</Text>
              <Text>O utilizador declara que:</Text>
              <UnorderedList pl={5}>
                <ListItem>As informações prestadas são verdadeiras;</ListItem>
                <ListItem>Caso seja menor de 16 anos, possui consentimento do responsável legal.</ListItem>
              </UnorderedList>
            </Box>
            <Box mb={3}>
              <Text fontWeight="bold">4.2 Empresas</Text>
              <Text>A entidade registada declara que:</Text>
              <UnorderedList pl={5}>
                <ListItem>O representante possui poderes para vincular a empresa;</ListItem>
                <ListItem>Cumprirá o RGPD no tratamento de dados recebidos.</ListItem>
              </UnorderedList>
            </Box>
            <Box>
              <Text fontWeight="bold">4.3 Municípios e Entidades Públicas</Text>
              <Text>A adesão poderá depender de protocolo institucional próprio.</Text>
            </Box>
          </Box>

          {/* 5. Regras de Utilização */}
          <Box>
            <Heading as="h2" size="md" mb={2}>5. Regras de Utilização</Heading>
            <Text>É proibido:</Text>
            <UnorderedList pl={5}>
              <ListItem>Fornecer informações falsas;</ListItem>
              <ListItem>Utilizar dados obtidos para fins não autorizados;</ListItem>
              <ListItem>Proceder à recolha massiva de dados da plataforma;</ListItem>
              <ListItem>Utilizar a plataforma para fins ilícitos.</ListItem>
            </UnorderedList>
            <Text mt={2}>A NIPEE reserva-se o direito de suspender contas em caso de incumprimento.</Text>
          </Box>

          {/* 6. Tratamento de Dados */}
          <Box>
            <Heading as="h2" size="md" mb={2}>
                6. Tratamento de Dados Pessoais
            </Heading>
            <Text>
                O tratamento de dados rege-se pela{" "}
                <Link 
                as={RouterLink} 
                to="/politica-de-privacidade" 
                color="blue.500" 
                fontWeight="medium"
                _hover={{ textDecoration: "underline", color: "blue.600" }}
                >
                Política de Privacidade da NIPEE
                </Link>
                . A NIPEE atua como responsável pelo tratamento dos dados no âmbito da gestão da plataforma.
            </Text>
            <Text mt={2}>
                As empresas utilizadoras tornam-se responsáveis autónomas pelos dados recebidos para efeitos de recrutamento.
            </Text>
            </Box>

          {/* 7. Dados de Menores */}
          <Box>
            <Heading as="h2" size="md" mb={2}>7. Dados de Menores</Heading>
            <Text>O tratamento de dados de menores depende de consentimento do responsável legal, nos termos do Regulamento (UE) 2016/679. A NIPEE poderá solicitar prova de legitimidade.</Text>
          </Box>

          {/* 8. Responsabilidade */}
          <Box>
            <Heading as="h2" size="md" mb={2}>8. Responsabilidade</Heading>
            <Text>A NIPEE:</Text>
            <UnorderedList pl={5}>
              <ListItem>Não garante a celebração de contratos entre utilizadores;</ListItem>
              <ListItem>Não é responsável pela veracidade das informações prestadas por terceiros;</ListItem>
              <ListItem>Não assume responsabilidade por decisões de recrutamento.</ListItem>
            </UnorderedList>
            <Text mt={2}>A responsabilidade da NIPEE limita-se ao funcionamento diligente da plataforma.</Text>
          </Box>

          {/* 9. Propriedade Intelectual */}
          <Box>
            <Heading as="h2" size="md" mb={2}>9. Propriedade Intelectual</Heading>
            <Text>Todos os conteúdos da plataforma, incluindo Marca NIPEE, Logótipo, Software e Base de dados são propriedade exclusiva da NIPEE ou devidamente licenciados. É proibida a reprodução sem autorização.</Text>
          </Box>

          {/* 10. Segurança */}
          <Box>
            <Heading as="h2" size="md" mb={2}>10. Segurança</Heading>
            <Text>A NIPEE implementa medidas técnicas e organizativas adequadas para proteger os dados. Contudo, não pode garantir segurança absoluta em ambiente digital.</Text>
          </Box>

          {/* 11. Suspensão */}
          <Box>
            <Heading as="h2" size="md" mb={2}>11. Suspensão e Cancelamento</Heading>
            <Text>A NIPEE pode suspender ou cancelar contas que violem os presentes Termos, coloquem em risco a segurança ou utilizem dados de forma ilícita. O utilizador pode encerrar a conta a qualquer momento.</Text>
          </Box>

          {/* 12. Alterações */}
          <Box>
            <Heading as="h2" size="md" mb={2}>12. Alterações aos Termos</Heading>
            <Text>A NIPEE reserva-se o direito de alterar os presentes Termos. As alterações serão comunicadas através da plataforma. Se forem substanciais, poderá ser solicitado novo aceite.</Text>
          </Box>

          {/* 13. Lei Aplicável */}
          <Box>
            <Heading as="h2" size="md" mb={2}>13. Lei Aplicável e Foro Competente</Heading>
            <Text>Os presentes Termos regem-se pela legislação portuguesa. Para resolução de litígios é competente o foro da comarca da sede da NIPEE, sem prejuízo das normas legais aplicáveis.</Text>
          </Box>

          {/* 14. Contacto */}
          <Box pb={10}>
            <Heading as="h2" size="md" mb={2}>14. Contacto</Heading>
            <Text>Para qualquer questão relacionada com estes Termos:</Text>
            <Text fontWeight="bold">Email: contacto@nipee.org</Text>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default TermosUtilizacao;