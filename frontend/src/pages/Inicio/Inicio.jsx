import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  VStack,
  HStack,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaAward,
  FaBullseye,
  FaChartLine,
  FaSchool,
  FaUserGraduate,
  FaBuilding,
  FaCheckCircle,
  FaDollarSign,
  FaClock,
  FaShieldAlt,
  FaCertificate,
  FaNetworkWired,
  FaBolt,
  FaFileAlt,
  FaHandshake,
  FaMobileAlt,
  FaHeadphones,
  FaBookOpen,
} from "react-icons/fa";
import illustation from "../../../src/images/img.png";
import illustation2 from "../../../src/images/img2.png";
import sobre from "../../../src/images/sobre.jpg";
import vagas from "../../../src/images/vagas.jpeg";
// import vagas from "../../../src/images/vagas.jpeg";
import empresa from "../../../src/images/empresa.jpg";
import escolas from "../../../src/images/escolas.jpg";

import Navbar from "../../components/Navbar/Navbar";
import FormularioContato from "../../components/FormularioContato/FormularioContato";
import BannerConsentimento from "../../components/BannerConsentimento/BannerConsentimento";
import FooterHome from "../../components/Footer/FooterHome";

const slides = [
  {
    eyebrow: "NIPEE para estudantes",
    title: "Menos burocracia,\nMais opcoes de FCT/Estagio",
    description:
      "Encontre oportunidades com mais rapidez e acompanhe cada etapa num processo mais simples, claro e organizado.",
    image: illustation,
    accent: "#155dfc",
    ctaPrimary: "Saiba Mais",
    ctaSecondary: { label: "Buscar Estagios", href: "/vagas-em-aberto" },
  },
  {
    eyebrow: "Parceria escola-empresa",
    title: "Parceria Escola-\nEmpresa",
    description:
      "Conectamos instituicoes de ensino e empresas para desenvolver o futuro profissional dos estudantes.",
    image: illustation2,
    accent: "#0f766e",
    ctaPrimary: "Saiba Mais",
    ctaSecondary: { label: "Falar Connosco", href: "/#contato" },
  },
  {
    eyebrow: "Gestao mais inteligente",
    title: "Tudo mais simples\npara escolas e empresas",
    description:
      "A plataforma ajuda a reduzir trocas manuais e melhora a visibilidade sobre candidaturas, colocacoes e progresso.",
    image: illustation,
    accent: "#ea580c",
    ctaPrimary: "Explorar",
    ctaSecondary: { label: "Sobre Nos", href: "/#sobre" },
  },
  {
    eyebrow: "Comeco simples",
    title: "Mais oportunidades,\nmenos demora",
    description:
      "Crie um ponto de encontro entre alunos, escolas e empresas com uma experiencia mais leve desde o primeiro acesso.",
    image: illustation2,
    accent: "#7c3aed",
    ctaPrimary: "Comecar Agora",
    ctaSecondary: { label: "Entrar", href: "/login" },
  },
];

const stats = [
  {
    icon: FaUsers,
    value: "15.000+",
    label: "Jovens Estagiando",
  },
  {
    icon: FaAward,
    value: "800+",
    label: "Escolas Parceiras",
  },
  {
    icon: FaBullseye,
    value: "2.500+",
    label: "Empresas Cadastradas",
  },
  {
    icon: FaChartLine,
    value: "25+",
    label: "Anos de Atuacao",
  },
];

const processSteps = [
  {
    number: "01",
    icon: FaSchool,
    title: "Escola se Cadastra",
    description:
      "A instituicao de ensino se registra em nossa plataforma e indica os estudantes elegiveis para participar do programa de estagio.",
  },
  {
    number: "02",
    icon: FaUserGraduate,
    title: "Estudante e Habilitado",
    description:
      "O aluno recebe acesso a plataforma onde pode visualizar vagas disponiveis e se candidatar aos estagios de seu interesse.",
  },
  {
    number: "03",
    icon: FaBuilding,
    title: "Empresa Seleciona",
    description:
      "Empresas parceiras analisam os perfis dos candidatos e realizam entrevistas para selecao dos estagiarios.",
  },
  {
    number: "04",
    icon: FaCheckCircle,
    title: "Estagio Confirmado",
    description:
      "Apos a selecao, toda documentacao e providenciada e o estudante inicia sua jornada profissional com acompanhamento continuo.",
  },
];

const studentBenefits = [
  {
    icon: FaDollarSign,
    title: "Remuneracao Garantida",
    description:
      "Todos os estagios sao remunerados conforme legislacao vigente, com bolsa-auxilio competitiva.",
  },
  {
    icon: FaClock,
    title: "Horario Flexivel",
    description:
      "Carga horaria compativel com seus estudos, respeitando sua jornada escolar.",
  },
  {
    icon: FaShieldAlt,
    title: "Seguro de Vida",
    description:
      "Todos os estagiarios contam com seguro de vida durante todo o periodo do estagio.",
  },
  {
    icon: FaChartLine,
    title: "Desenvolvimento Profissional",
    description:
      "Ganhe experiencia real no mercado de trabalho e desenvolva habilidades essenciais.",
  },
  {
    icon: FaCertificate,
    title: "Certificado",
    description:
      "Ao final do estagio, voce recebe certificado comprovando sua experiencia profissional.",
  },
  {
    icon: FaNetworkWired,
    title: "Networking",
    description:
      "Construa conexoes profissionais valiosas que podem abrir portas para sua carreira.",
  },
];

const companyBenefits = [
  {
    icon: FaUsers,
    title: "Talentos Qualificados",
    description:
      "Acesso a um pool de jovens estudantes motivados e pre-selecionados pelas escolas parceiras.",
  },
  {
    icon: FaBolt,
    title: "Processo Agil",
    description:
      "Plataforma digital que facilita a divulgacao de vagas e selecao de candidatos.",
  },
  {
    icon: FaFileAlt,
    title: "Documentacao Simplificada",
    description:
      "Cuidamos de toda burocracia e documentacao necessaria para contratacao de estagiarios.",
  },
  {
    icon: FaChartLine,
    title: "Desenvolvimento de Talentos",
    description:
      "Forme profissionais alinhados com a cultura e necessidades da sua empresa.",
  },
  {
    icon: FaBullseye,
    title: "Responsabilidade Social",
    description:
      "Contribua para o desenvolvimento de jovens e fortaleca a imagem da sua empresa.",
  },
  {
    icon: FaHandshake,
    title: "Suporte Continuo",
    description:
      "Nossa equipe oferece acompanhamento durante todo o periodo do estagio.",
  },
];

const companyChecklist = [
  {
    title: "Sem custos de intermediacao",
    description: "Cadastro e acesso a plataforma totalmente gratuitos",
  },
  {
    title: "Flexibilidade nas contratacoes",
    description: "Defina o perfil ideal e quantidade de vagas conforme sua necessidade",
  },
  {
    title: "Conformidade legal garantida",
    description: "Todos os contratos seguem rigorosamente a Lei do Estagio",
  },
];

const schoolBenefits = [
  {
    icon: FaMobileAlt,
    title: "Plataforma Digital",
    description:
      "Sistema online completo para gestao de estudantes e acompanhamento de estagios.",
  },
  {
    icon: FaUserGraduate,
    title: "Indicacao Simplificada",
    description:
      "Processo facil e rapido para indicar estudantes elegiveis ao programa de estagios.",
  },
  {
    icon: FaChartLine,
    title: "Relatorios Detalhados",
    description:
      "Acompanhe o desempenho e desenvolvimento dos seus alunos em tempo real.",
  },
  {
    icon: FaHeadphones,
    title: "Suporte Dedicado",
    description:
      "Equipe especializada para auxiliar em todas as etapas do processo.",
  },
  {
    icon: FaAward,
    title: "Reconhecimento",
    description:
      "Certificacao e reconhecimento como escola parceira comprometida com a educacao.",
  },
  {
    icon: FaBookOpen,
    title: "Capacitacao Gratuita",
    description:
      "Workshops e treinamentos para orientar estudantes sobre o mercado de trabalho.",
  },
];

const schoolProcess = [
  "Realize o cadastro da instituicao em nossa plataforma",
  "Indique os estudantes elegiveis para participacao",
  "Acompanhe o desenvolvimento dos alunos atraves da plataforma",
  "Receba relatorios periodicos sobre o desempenho dos estagiarios",
];

const Inicio = () => {
  const location = useLocation();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];

  const goToCandidateRegister = () => {
    window.location.href = "/registar-candidato";
  };

  return (
    <div>
      <Box bg="#F9FAFB">
        <Navbar />

        {/* Secao principal */}
        <Box mt={{ base: 24, md: 28 }} mb={8} position="relative" w="100%">
          <Box
            position="relative"
            overflow="hidden"
            minH={{ base: "560px", md: "650px" }}
            bg="#0f172a"
            color="white"
          >
            <Box
              position="absolute"
              inset="0"
              bgImage={`url(${currentSlide.image})`}
              bgRepeat="no-repeat"
              bgPosition="center"
              bgSize={{ base: "cover", md: "contain" }}
              opacity={0.28}
              transform="scale(1.08)"
            />
            <Box
              position="absolute"
              inset="0"
              bg={`linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.76) 36%, rgba(15, 23, 42, 0.52) 62%, rgba(15, 23, 42, 0.72) 100%), linear-gradient(120deg, ${currentSlide.accent}22 0%, transparent 58%)`}
            />

            <Flex
              position="relative"
              align="center"
              minH={{ base: "560px", md: "650px" }}
              px={{ base: 6, md: 12, xl: 20 }}
            >
              <VStack
                align={{ base: "start", lg: "start" }}
                spacing={7}
                maxW="650px"
                textAlign="left"
              >
                <Text
                  fontSize={{ base: "xs", md: "xs" }}
                  fontWeight="bold"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color="whiteAlpha.800"
                >
                  {currentSlide.eyebrow}
                </Text>

                <Box
                  as="h1"
                  whiteSpace="pre-line"
                  fontSize={{ base: "4xl", md: "6xl", lg: "60px" }}
                  fontWeight="bold"
                  lineHeight={{ base: "1.08", md: "0.98" }}
                  letterSpacing="-0.03em"
                  mt={{ base: 12, md: 12 }}
                >
                  {currentSlide.title}
                </Box>

                <Text
                  fontSize={{ base: "base", md: "xl" }}
                  color="whiteAlpha.900"
                  maxW="700px"
                  lineHeight="1.45"
                >
                  {currentSlide.description}
                </Text>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={4}
                  justify="start"
                  align={{ base: "stretch", md: "center" }}
                  w={{ base: "100%", md: "auto" }}
                >
                  <Button
                    size="base"
                    px={8}
                    py={4}
                    cursor="pointer"
                    borderRadius="full"
                    bg="#155dfc"
                    color="white"
                    fontWeight="bold"
                    boxShadow="0 12px 32px rgba(21, 93, 252, 0.3)"
                    _hover={{ bg: "#0f4fd6" }}
                    onClick={
                      currentSlide.ctaPrimary === "Saiba Mais"
                        ? undefined
                        : goToCandidateRegister
                    }
                    as={
                      currentSlide.ctaPrimary === "Saiba Mais" ? "a" : undefined
                    }
                    href={
                      currentSlide.ctaPrimary === "Saiba Mais"
                        ? "/#sobre"
                        : undefined
                    }
                    w={{ base: "100%", md: "auto" }}
                  >
                    {currentSlide.ctaPrimary}
                  </Button>
                  <Button
                    as="a"
                    href={currentSlide.ctaSecondary.href}
                    size="base"
                    px={8}
                    py={4}
                    cursor="pointer"
                    borderRadius="full"
                    bg="white"
                    color="#155dfc"
                    border="1px solid rgba(255,255,255,0.32)"
                    _hover={{ bg: "rgba(255,255,255,0.92)" }}
                    w={{ base: "100%", md: "auto" }}
                  >
                    {currentSlide.ctaSecondary.label}
                  </Button>
                </Stack>
              </VStack>
            </Flex>

            <Flex
              position="absolute"
              left={{ base: 3, md: 5 }}
              right={{ base: 3, md: 5 }}
              top="50%"
              transform="translateY(-50%)"
              justify="space-between"
              pointerEvents="none"
            >
              <IconButton
                aria-label="Slide anterior"
                icon={<Icon as={FaChevronLeft} boxSize={4} />}
                onClick={() =>
                  setActiveSlide(
                    (current) => (current - 1 + slides.length) % slides.length,
                  )
                }
                borderRadius="full"
                w={{ base: "48px", md: "56px" }}
                h={{ base: "48px", md: "56px" }}
                bg="rgba(255,255,255,0.16)"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.28)" }}
                pointerEvents="auto"
              />
              <IconButton
                aria-label="Proximo slide"
                icon={<Icon as={FaChevronRight} boxSize={4} />}
                onClick={() =>
                  setActiveSlide((current) => (current + 1) % slides.length)
                }
                borderRadius="full"
                w={{ base: "48px", md: "56px" }}
                h={{ base: "48px", md: "56px" }}
                bg="rgba(255,255,255,0.16)"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.28)" }}
                pointerEvents="auto"
              />
            </Flex>

            <HStack
              position="absolute"
              bottom={{ base: 5, md: 6 }}
              left="50%"
              transform="translateX(-50%)"
              spacing={3}
            >
              {slides.map((slide, index) => (
                <Box
                  key={slide.title}
                  as="button"
                  onClick={() => setActiveSlide(index)}
                  w={activeSlide === index ? "34px" : "10px"}
                  h="10px"
                  borderRadius="full"
                  bg={activeSlide === index ? "white" : "whiteAlpha.600"}
                  transition="all 0.2s ease"
                />
              ))}
            </HStack>
          </Box>
        </Box>

        <Box px={{ base: 4, md: 8 }}>
          {/* Secao "Sobre nos" */}
          <Flex
            id="sobre"
            maxW="1200px"
            mx="auto"
            align="start"
            direction={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            gap={{ base: 10, lg: 16 }}
            py={{ base: 12, md: 16 }}
          >
            <VStack
              align="start"
              spacing={7}
              flex="1"
              maxW="620px"
              textAlign="left"
            >
              <Box
                as="h2"
                m={0}
                fontSize={{ base: "30px", md: "36px" }}
                fontWeight="bold"
                lineHeight="1.1"
                color="#172036"
              >
                Quem Somos
              </Box>

              <Text fontSize={{ base: "16px", md: "18px" }} color="#42506a" lineHeight="1.75">
                Somos uma organizacao sem fins lucrativos dedicada a conectar jovens estudantes ao mercado de trabalho atraves de programas de estagio. Trabalhamos em parceria com escolas e empresas para proporcionar oportunidades reais de desenvolvimento profissional.
              </Text>

              <Text fontSize={{ base: "16px", md: "18px" }} color="#42506a" lineHeight="1.75">
                Nossa missao e transformar vidas atraves da primeira experiencia profissional, oferecendo acesso gratuito a estagios de qualidade para estudantes de escolas parceiras em todo o pais.
              </Text>

              <Text fontSize={{ base: "16px", md: "18px" }} color="#42506a" lineHeight="1.75">
                Facilitamos todo o processo: desde o cadastro das escolas, passando pela selecao dos estudantes, ate a conexao com empresas que buscam jovens talentos para seus programas de estagio.
              </Text>

              <Button
                as="a"
                href="/registar-candidato"
                bg="#155dfc"
                color="white"
                cursor="pointer"
                px={8}
                py={7}
                borderRadius="full"
                fontWeight="bold"
                boxShadow="0 14px 30px rgba(21, 93, 252, 0.24)"
                _hover={{ bg: "#0f4fd6" }}
              >
                Conheca Nossa Historia
              </Button>
            </VStack>

            <Box flex="1" w="100%">
              <Box
                overflow="hidden"
                borderRadius="28px"
                boxShadow="0 24px 50px rgba(15, 23, 42, 0.16)"
                bg="white"
              >
                <Box
                  as="img"
                  src={sobre}
                  alt="Equipa reunida a colaborar"
                  w="100%"
                  maxW={{ base: "100%", lg: "650px" }}
                  h={{ base: "280px", md: "360px", lg: "395px" }}
                  objectFit="cover"
                />
              </Box>
            </Box>
          </Flex>

          <Box maxW="1200px" mx="auto" pb={{ base: 12, md: 16 }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={6}
              justify="space-between"
              mt={4}
            >
              {stats.map((item) => (
                <Box
                  key={item.label}
                  flex="1"
                  bg="white"
                  borderRadius="24px"
                  px={8}
                  py={8}
                  textAlign="center"
                  boxShadow="0 10px 28px rgba(15, 23, 42, 0.09)"
                >
                  <Flex
                    w="56px"
                    h="56px"
                    mx="auto"
                    mb={5}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="#dbeafe"
                    color="#155dfc"
                  >
                    <Icon as={item.icon} boxSize={6} />
                  </Flex>
                  <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="#172036">
                    {item.value}
                  </Text>
                  <Text mt={2} fontSize={{ base: "md", md: "lg" }} color="#5b6980">
                    {item.label}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>

          <Box
            bg="white"
            py={{ base: 16, md: 20 }}
          >
            <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
              <VStack spacing={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Box
                  as="h2"
                  m={0}
                  fontSize={{ base: "30px", md: "36px" }}
                  fontWeight="bold"
                  lineHeight="1.15"
                  color="#172036"
                >
                  Como Funciona
                </Box>
                <Text
                  maxW="760px"
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.7"
                  color="#52617a"
                >
                  Um processo simples e eficiente que conecta estudantes, escolas e empresas para criar oportunidades reais de desenvolvimento profissional
                </Text>
              </VStack>

              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 8, lg: 6 }}
                justify="center"
                align="stretch"
              >
                {processSteps.map((step, index) => (
                  <Box
                    key={step.number}
                    position="relative"
                    flex="1"
                    maxW={{ base: "100%", lg: "285px" }}
                    transition="transform 0.25s ease, box-shadow 0.25s ease"
                    _hover={{
                      transform: "scale(1.03)",
                    }}
                  >
                    <Box
                      position="absolute"
                      top="-12px"
                      left="-12px"
                      zIndex={2}
                      w="52px"
                      h="52px"
                      borderRadius="full"
                      bg="#155dfc"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="20px"
                      fontWeight="bold"
                      boxShadow="0 14px 30px rgba(21, 93, 252, 0.28)"
                    >
                      {step.number}
                    </Box>

                    <Box
                      bg="white"
                      border="1px solid #d9e0ea"
                      borderRadius="20px"
                      px={{ base: 6, md: 7 }}
                      pt="42px"
                      pb={7}
                      minH={{ base: "auto", lg: "258px" }}
                      boxShadow="0 4px 14px rgba(15, 23, 42, 0.03)"
                      transition="box-shadow 0.25s ease, transform 0.25s ease"
                      _hover={{
                        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.14)",
                      }}
                    >
                      <Flex
                        w="62px"
                        h="62px"
                        align="center"
                        justify="center"
                        borderRadius="full"
                        bg="#dbeafe"
                        color="#155dfc"
                        mb={6}
                      >
                        <Icon as={step.icon} boxSize="32px" />
                      </Flex>

                      <Box
                        as="h3"
                        m={0}
                        mb={3}
                        fontSize="20px"
                        fontWeight="bold"
                        lineHeight="1.2"
                        color="#172036"
                      >
                        {step.title}
                      </Box>

                      <Text fontSize="16px" lineHeight="1.65" color="#52617a">
                        {step.description}
                      </Text>
                    </Box>

                    {index < processSteps.length - 1 && (
                      <Box
                        display={{ base: "none", lg: "block" }}
                        position="absolute"
                        right="-18px"
                        top="50%"
                        transform="translateY(-50%)"
                        w="24px"
                        h="2px"
                        bg="#93c5fd"
                      />
                    )}
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>

          <Box
            bg="#f3f8ff"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
          >
            <Box maxW="1200px" mx="auto">
              <VStack spacing={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Box
                  as="h2"
                  m={0}
                  fontSize={{ base: "30px", md: "36px" }}
                  fontWeight="bold"
                  lineHeight="1.15"
                  color="#172036"
                >
                  Para Estudantes
                </Box>
                <Text
                  maxW="720px"
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.65"
                  color="#52617a"
                >
                  Descubra os beneficios de fazer parte do nosso programa de estagios e de o primeiro passo na sua carreira profissional
                </Text>
              </VStack>

              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 10, lg: 12 }}
                align="center"
                mb={{ base: 12, md: 14 }}
              >
                <Box flex="1" w="100%">
                  <Box
                    bg="white"
                    borderRadius="10px"
                    overflow="hidden"
                    boxShadow="0 20px 45px rgba(15, 23, 42, 0.14)"
                    border="1px solid rgba(15, 23, 42, 0.05)"
                  >
                    <Box
                      as="img"
                      src={vagas}
                      alt="Painel de vagas para estudantes"
                      w="100%"
                      h={{ base: "250px", md: "310px" }}
                      objectFit="contain"
                      bg="#f8fbff"
                      p={{ base: 4, md: 6 }}
                    />
                  </Box>
                </Box>

                <VStack align="start" flex="1" spacing={5} textAlign="left">
                  <Box
                    as="h3"
                    m={0}
                    fontSize={{ base: "26px", md: "32px" }}
                    fontWeight="bold"
                    lineHeight="1.2"
                    color="#172036"
                  >
                    Sua Primeira Experiencia Profissional
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Se voce e estudante de uma escola parceira, tem a oportunidade de participar do nosso programa de estagios totalmente gratuito.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Oferecemos vagas em empresas de diversos segmentos: administracao, tecnologia, saude, educacao, varejo e muito mais. Voce escolhe a area que mais combina com seu perfil e objetivos de carreira.
                  </Text>

                  <Box
                    w="100%"
                    bg="#dbeafe"
                    borderLeft="4px solid #155dfc"
                    borderRadius="8px"
                    p={{ base: 5, md: 6 }}
                  >
                    <Text fontSize="16px" fontWeight="bold" color="#172036" mb={3}>
                      Requisitos para Participar:
                    </Text>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="16px" color="#155dfc">- Estar matriculado em escola parceira</Text>
                      <Text fontSize="16px" color="#155dfc">- Ter entre 14 e 24 anos</Text>
                      <Text fontSize="16px" color="#155dfc">- Disponibilidade de 4 a 6 horas diarias</Text>
                      <Text fontSize="16px" color="#155dfc">- Comprometimento com os estudos</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                wrap="wrap"
                gap={7}
                justify="center"
              >
                {studentBenefits.map((benefit) => (
                  <Box
                    key={benefit.title}
                    bg="white"
                    borderRadius="14px"
                    p={{ base: 6, md: 7 }}
                    flex={{ base: "1 1 100%", md: "1 1 calc(50% - 28px)", lg: "1 1 calc(33.333% - 28px)" }}
                    maxW={{ base: "100%", lg: "360px" }}
                    minH="190px"
                    boxShadow="0 10px 26px rgba(15, 23, 42, 0.08)"
                    transition="transform 0.25s ease, box-shadow 0.25s ease"
                    _hover={{
                      transform: "scale(1.03)",
                      boxShadow: "0 20px 42px rgba(15, 23, 42, 0.14)",
                    }}
                  >
                    <Flex
                      w="52px"
                      h="52px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="#dbeafe"
                      color="#155dfc"
                      mb={6}
                    >
                      <Icon as={benefit.icon} boxSize="24px" />
                    </Flex>
                    <Box
                      as="h3"
                      m={0}
                      mb={4}
                      fontSize="18px"
                      fontWeight="bold"
                      lineHeight="1.2"
                      color="#172036"
                    >
                      {benefit.title}
                    </Box>
                    <Text fontSize="16px" lineHeight="1.65" color="#52617a">
                      {benefit.description}
                    </Text>
                  </Box>
                ))}
              </Flex>

              <Flex justify="center" mt={{ base: 10, md: 12 }}>
                <Button
                  as="a"
                  href="/vagas-em-aberto"
                  bg="#155dfc"
                  color="white"
                  cursor="pointer"
                  px={9}
                  py={6}
                  borderRadius="full"
                  fontWeight="bold"
                  boxShadow="0 14px 30px rgba(21, 93, 252, 0.22)"
                  _hover={{ bg: "#0f4fd6", transform: "translateY(-1px)" }}
                  transition="all 0.2s ease"
                >
                  Consulte Vagas Disponiveis
                </Button>
              </Flex>
            </Box>
          </Box>

          <Box bg="white" py={{ base: 16, md: 20 }} px={{ base: 4, md: 8 }}>
            <Box maxW="1200px" mx="auto">
              <VStack spacing={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Box
                  as="h2"
                  m={0}
                  fontSize={{ base: "30px", md: "36px" }}
                  fontWeight="bold"
                  lineHeight="1.15"
                  color="#172036"
                >
                  Para Empresas
                </Box>
                <Text
                  maxW="700px"
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.65"
                  color="#52617a"
                >
                  Encontre os melhores talentos jovens para sua empresa e contribua para o desenvolvimento profissional da proxima geracao
                </Text>
              </VStack>

              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 10, lg: 14 }}
                align="center"
                mb={{ base: 12, md: 14 }}
              >
                <VStack align="start" flex="1" spacing={5} textAlign="left">
                  <Box
                    as="h3"
                    m={0}
                    fontSize={{ base: "26px", md: "32px" }}
                    fontWeight="bold"
                    lineHeight="1.2"
                    color="#172036"
                  >
                    Faca Parte da Nossa Rede de Empresas Parceiras
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Conectamos sua empresa com estudantes talentosos que estao buscando sua primeira oportunidade profissional. Nossa plataforma facilita todo o processo de selecao e contratacao.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Com mais de 15.000 estudantes cadastrados de 800+ escolas parceiras, voce tem acesso a um amplo leque de candidatos qualificados em diversas areas de atuacao.
                  </Text>

                  <VStack align="start" spacing={4} w="100%">
                    {companyChecklist.map((item) => (
                      <Flex key={item.title} align="start" gap={4}>
                        <Flex
                          w="32px"
                          h="32px"
                          align="center"
                          justify="center"
                          borderRadius="full"
                          bg="#dcfce7"
                          color="#16a34a"
                          flexShrink={0}
                        >
                          <Icon as={FaCheckCircle} boxSize="16px" />
                        </Flex>
                        <Box>
                          <Text fontSize="16px" fontWeight="bold" color="#172036">
                            {item.title}
                          </Text>
                          <Text fontSize="15px" color="#52617a" lineHeight="1.5">
                            {item.description}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </VStack>

                <Box flex="1" w="100%">
                  <Box
                    overflow="hidden"
                    borderRadius="14px"
                    boxShadow="0 24px 50px rgba(15, 23, 42, 0.16)"
                  >
                    <Box
                      as="img"
                      src={empresa}
                      alt="Empresas parceiras em reuniao"
                      w="100%"
                      h={{ base: "260px", md: "360px" }}
                      objectFit="cover"
                      bg="#f8fbff"
                    />
                  </Box>
                </Box>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                wrap="wrap"
                gap={7}
                justify="center"
                mb={{ base: 10, md: 12 }}
              >
                {companyBenefits.map((benefit) => (
                  <Box
                    key={benefit.title}
                    bg="#F9FAFB"
                    border="1px solid #e5e7eb"
                    borderRadius="14px"
                    p={{ base: 6, md: 7 }}
                    flex={{ base: "1 1 100%", md: "1 1 calc(50% - 28px)", lg: "1 1 calc(33.333% - 28px)" }}
                    maxW={{ base: "100%", lg: "360px" }}
                    minH="190px"
                    transition="transform 0.25s ease, box-shadow 0.25s ease"
                    _hover={{
                      transform: "scale(1.03)",
                      boxShadow: "0 20px 42px rgba(15, 23, 42, 0.12)",
                    }}
                  >
                    <Flex
                      w="52px"
                      h="52px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="#dbeafe"
                      color="#155dfc"
                      mb={6}
                    >
                      <Icon as={benefit.icon} boxSize="24px" />
                    </Flex>
                    <Box
                      as="h3"
                      m={0}
                      mb={4}
                      fontSize="18px"
                      fontWeight="bold"
                      lineHeight="1.2"
                      color="#172036"
                    >
                      {benefit.title}
                    </Box>
                    <Text fontSize="16px" lineHeight="1.65" color="#52617a">
                      {benefit.description}
                    </Text>
                  </Box>
                ))}
              </Flex>

              <Box
                bg="#155dfc"
                color="white"
                borderRadius="16px"
                py={{ base: 10, md: 12 }}
                px={{ base: 6, md: 10 }}
                textAlign="center"
              >
                <Box
                  as="h3"
                  m={0}
                  mb={4}
                  fontSize={{ base: "26px", md: "32px" }}
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  Pronto para Encontrar Novos Talentos?
                </Box>
                <Text fontSize={{ base: "16px", md: "18px" }} mb={7} color="whiteAlpha.900">
                  Cadastre sua empresa gratuitamente e comece a publicar vagas hoje mesmo
                </Text>
                <Button
                  as="a"
                  href="/registar-empresa"
                  bg="white"
                  color="#155dfc"
                  cursor="pointer"
                  px={10}
                  py={6}
                  borderRadius="full"
                  fontWeight="bold"
                  _hover={{ bg: "rgba(255,255,255,0.92)", transform: "translateY(-1px)" }}
                  transition="all 0.2s ease"
                >
                  Cadastrar Empresa
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            bg="#f3f8ff"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
          >
            <Box maxW="1200px" mx="auto">
              <VStack spacing={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Box
                  as="h2"
                  m={0}
                  fontSize={{ base: "30px", md: "36px" }}
                  fontWeight="bold"
                  lineHeight="1.15"
                  color="#172036"
                >
                  Para Escolas
                </Box>
                <Text
                  maxW="680px"
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.65"
                  color="#52617a"
                >
                  Parceria que amplia as oportunidades dos seus estudantes e fortalece o compromisso da sua instituicao com a educacao integral
                </Text>
              </VStack>

              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 10, lg: 12 }}
                align="center"
                mb={{ base: 12, md: 14 }}
              >
                <Box flex="1" w="100%">
                  <Box
                    overflow="hidden"
                    borderRadius="14px"
                    boxShadow="0 24px 50px rgba(15, 23, 42, 0.16)"
                    bg="#111827"
                  >
                    <Box
                      as="img"
                      src={escolas}
                      alt="Ambiente escolar parceiro"
                      w="100%"
                      h={{ base: "280px", md: "405px" }}
                      objectFit="cover"
                      opacity={0.72}
                    />
                  </Box>
                </Box>

                <VStack align="start" flex="1" spacing={5} textAlign="left">
                  <Box
                    as="h3"
                    m={0}
                    fontSize={{ base: "26px", md: "32px" }}
                    fontWeight="bold"
                    lineHeight="1.2"
                    color="#172036"
                  >
                    Torne-se uma Escola Parceira
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Ao se cadastrar como escola parceira, voce oferece aos seus estudantes acesso a milhares de oportunidades de estagio em empresas renomadas de todo o pais.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Nao ha custos para a escola. Nossa missao e facilitar a conexao entre educacao e mercado de trabalho, preparando os jovens para um futuro profissional de sucesso.
                  </Text>

                  <Box
                    w="100%"
                    bg="white"
                    border="1px solid #bfdbfe"
                    borderRadius="10px"
                    p={{ base: 5, md: 6 }}
                  >
                    <Text fontSize="16px" fontWeight="bold" color="#172036" mb={4}>
                      Como Funciona para a Escola:
                    </Text>
                    <VStack align="start" spacing={3}>
                      {schoolProcess.map((item, index) => (
                        <Flex key={item} align="center" gap={3}>
                          <Flex
                            w="20px"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="full"
                            bg="#155dfc"
                            color="white"
                            fontSize="12px"
                            fontWeight="bold"
                            flexShrink={0}
                          >
                            {index + 1}
                          </Flex>
                          <Text fontSize="15px" color="#42506a">
                            {item}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  <Button
                    as="a"
                    href="/registar-empresa"
                    bg="#155dfc"
                    color="white"
                    cursor="pointer"
                    px={8}
                    py={6}
                    borderRadius="full"
                    fontWeight="bold"
                    boxShadow="0 14px 30px rgba(21, 93, 252, 0.22)"
                    _hover={{ bg: "#0f4fd6", transform: "translateY(-1px)" }}
                    transition="all 0.2s ease"
                  >
                    Cadastrar Escola
                  </Button>
                </VStack>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                wrap="wrap"
                gap={7}
                justify="center"
              >
                {schoolBenefits.map((benefit) => (
                  <Box
                    key={benefit.title}
                    bg="white"
                    borderRadius="14px"
                    p={{ base: 6, md: 7 }}
                    flex={{ base: "1 1 100%", md: "1 1 calc(50% - 28px)", lg: "1 1 calc(33.333% - 28px)" }}
                    maxW={{ base: "100%", lg: "360px" }}
                    minH="180px"
                    boxShadow="0 10px 26px rgba(15, 23, 42, 0.08)"
                    transition="transform 0.25s ease, box-shadow 0.25s ease"
                    _hover={{
                      transform: "scale(1.03)",
                      boxShadow: "0 20px 42px rgba(15, 23, 42, 0.14)",
                    }}
                  >
                    <Flex
                      w="52px"
                      h="52px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="#dbeafe"
                      color="#155dfc"
                      mb={6}
                    >
                      <Icon as={benefit.icon} boxSize="24px" />
                    </Flex>
                    <Box
                      as="h3"
                      m={0}
                      mb={4}
                      fontSize="18px"
                      fontWeight="bold"
                      lineHeight="1.2"
                      color="#172036"
                    >
                      {benefit.title}
                    </Box>
                    <Text fontSize="16px" lineHeight="1.65" color="#52617a">
                      {benefit.description}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* <FormularioRegistro id="registrar" /> */}

          <FormularioContato />

          <BannerConsentimento />
        </Box>
      </Box>
      <FooterHome />
    </div>
  );
};

export default Inicio;
