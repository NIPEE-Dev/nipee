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
  FaMobileAlt,
  FaHeadphones,
  FaBookOpen,
} from "react-icons/fa";
import illustation from "../../../src/images/img.png";
import slide1 from "../../../src/images/slide1.jpg";
import slide2 from "../../../src/images/slide2.jpg";
import slide3 from "../../../src/images/slide3.jpg";
import slide4 from "../../../src/images/slide4.png";
import illustation2 from "../../../src/images/img2.png";
import sobre from "../../../src/images/sobre.jpg";
import imagem5 from "../../../src/images/imagem5.jpg";
import imagem6 from "../../../src/images/imagem6.png";
import imagem7 from "../../../src/images/imagem7.jpg";

import Navbar from "../../components/Navbar/Navbar";
import FormularioContato from "../../components/FormularioContato/FormularioContato";
import BannerConsentimento from "../../components/BannerConsentimento/BannerConsentimento";
import FooterHome from "../../components/Footer/FooterHome";

const slides = [
  {
    eyebrow: "Parcerias Escola-Empresa",
    title: "Ligamos Talento Jovem\n ao Mercado de Trabalho",
    description:
      "Aproximamos escolas e escolas para criar oportunidades reais de Formação em Contexto de Trabalho, preparando os estudantes para o futuro profissional.",
    image: slide1,
    accent: "#155dfc",
    ctaPrimary: { label: "Saber Mais", href: "/#sobre" },
    ctaSecondary: { label: "Falar Connosco", href: "/vagas-em-aberto" },
  },
  {
    eyebrow: "Gestão Inteligente de Estágios",
    title: "Simplifique a Gestão entre Escolas e Empresas",
    description:
      "Centralize candidaturas, acompanhe o progresso dos alunos e elimine processos manuais com uma plataforma única e eficiente.",
    image: slide2,
    accent: "#0f766e",
    ctaPrimary: { label: "Ver Plataforma", href: "/registar-empresa" },
    ctaSecondary: { label: "Pedir Demonstração", href: "/#contato" },
  },
  {
    eyebrow: "NIPEE para Estudantes",
    title: "Menos burocracia. Mais oportunidades de estágio.",
    description:
      "Encontre oportunidades de FCT com rapidez, candidate-se facilmente e acompanhe todo o processo de forma simples e transparente.",
    image: slide3,
    accent: "#7c3aed",
    ctaPrimary: { label: "Explorar Oportunidades", href: "/vagas-em-aberto" },
    ctaSecondary: { label: "Começar Agora", href: "/registar-candidato" },
  },
  {
    eyebrow: "Comece em poucos minutos",
    title: "Comece hoje. Simplifique todo o processo.",
    description:
      "Registe-se gratuitamente e comece a ligar alunos, escolas e empresas numa única plataforma simples e eficiente.",
    image: slide4,
    accent: "#ea580c",
    ctaPrimary: { label: "Criar Conta Gratuita", href: "/registar-empresa" },
    ctaSecondary: { label: "Iniciar Sessão", href: "/login" },
  },
];

const growthHighlights = [
  {
    title: "Plataforma em crescimento",
    description: "A ligar escolas, empresas e estudantes em todo o país",
  },
  {
    title: "Processos simplificados",
    description: "Gestão digital de FCT e estágios num único local",
  },
  {
    title: "Acompanhamento contínuo",
    description: "Do registo à conclusão do estágio",
  },
  {
    title: "Foco na empregabilidade jovem",
    description: "Apoio real à transição para o mercado de trabalho",
  },
];

const processSteps = [
  {
    number: "01",
    icon: FaSchool,
    title: "Escola entra em contacto",
    description:
      "A instituicao de ensino entra em contacto com a equipa NIPEE para adesao a plataforma. O processo e acompanhado, garantindo uma integracao adequada e alinhada com as necessidades da escola.",
  },
  {
    number: "02",
    icon: FaUserGraduate,
    title: "Estudante acede e candidata-se",
    description:
      "Apos validacao da escola, os estudantes tem acesso a plataforma, onde podem consultar oportunidades e candidatar-se as que melhor se adequam ao seu perfil.",
  },
  {
    number: "03",
    icon: FaBuilding,
    title: "Empresa seleciona",
    description:
      "As empresas analisam os perfis dos candidatos e realizam entrevistas para selecionar os estagiarios mais adequados.",
  },
  {
    number: "04",
    icon: FaCheckCircle,
    title: "Estagio confirmado",
    description:
      "Apos a selecao, o processo e formalizado e o estudante inicia o estagio com acompanhamento ao longo de toda a experiencia.",
  },
];

const studentBenefits = [
  {
    icon: FaDollarSign,
    title: "Possibilidade de bolsa de estágio",
    description:
      "Algumas oportunidades podem incluir bolsa de estágio, de acordo com a entidade acolhedora e o tipo de programa.",
  },
  {
    icon: FaClock,
    title: "Horário compatível com os estudos",
    description:
      "A carga horária é definida em articulação com a escola, garantindo compatibilidade com o percurso formativo.",
  },
  {
    icon: FaShieldAlt,
    title: "Seguro incluído",
    description:
      "Os estudantes estão abrangidos por seguro durante todo o período de Formação em Contexto de Trabalho.",
  },
  {
    icon: FaChartLine,
    title: "Desenvolvimento profissional",
    description:
      "Adquira experiência prática em contexto real e desenvolva competências valorizadas no mercado de trabalho.",
  },
  {
    icon: FaCertificate,
    title: "Reconhecimento e certificação",
    description:
      "A experiência em FCT contribui para a avaliação e conclusão do percurso formativo.",
  },
  {
    icon: FaNetworkWired,
    title: "Contacto com o mercado de trabalho",
    description:
      "Estabeleça relações com empresas e aumente as suas oportunidades futuras.",
  },
];

const companyBenefits = [
  {
    icon: FaChartLine,
    title: "Desenvolvimento de talento",
    description:
      "Identifique e acompanhe jovens com potencial, alinhados com a cultura e necessidades da sua empresa.",
  },
  {
    icon: FaBullseye,
    title: "Responsabilidade social",
    description:
      "Contribua para a formação de jovens e reforce o posicionamento da sua empresa no mercado.",
  },
  {
    icon: FaHeadphones,
    title: "Acompanhamento contínuo",
    description:
      "A nossa equipa assegura apoio durante todo o processo, desde a integração até à conclusão do estágio.",
  },
];

const schoolBenefits = [
  {
    icon: FaMobileAlt,
    title: "Plataforma digital",
    description:
      "Solução online completa para gestão de alunos e acompanhamento de estágios e FCT.",
  },
  {
    icon: FaUserGraduate,
    title: "Indicação simplificada",
    description:
      "Processo simples e rápido para identificar e acompanhar alunos elegíveis para os programas.",
  },
  {
    icon: FaChartLine,
    title: "Relatórios detalhados",
    description:
      "Acompanhe o desempenho e evolução dos seus alunos com informação atualizada.",
  },
  {
    icon: FaHeadphones,
    title: "Apoio dedicado",
    description:
      "Equipa especializada disponível para apoiar a escola em todas as etapas do processo.",
  },
  {
    icon: FaAward,
    title: "Reconhecimento institucional",
    description:
      "Valorização da escola enquanto entidade parceira comprometida com a formação dos alunos.",
  },
  {
    icon: FaBookOpen,
    title: "Formação gratuita",
    description:
      "Acesso a workshops e sessões de orientação sobre o mercado de trabalho e empregabilidade.",
  },
];

const schoolProcess = [
  {
    title: "Contacto inicial",
    description:
      "A escola entra em contacto com a equipa NIPEE para adesão à plataforma.",
  },
  {
    title: "Integração acompanhada",
    description:
      "É realizada a configuração da escola e o alinhamento dos processos.",
  },
  {
    title: "Gestão de alunos",
    description: "A escola indica os alunos elegíveis e acompanha o seu percurso.",
  },
  {
    title: "Acompanhamento contínuo",
    description:
      "Acesso à informação e relatórios sobre o desempenho dos alunos.",
  },
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

  return (
    <div>
      <Box bg="#F9FAFB">
        <Navbar />

        {/* Secao principal */}
        <Box
          mt={{ base: 24, md: 28 }}
          mb={8}
          position="relative"
          w="100%"
          maxW="100%"
          overflow="hidden"
        >
          <Box
            position="relative"
            overflow="hidden"
            minH={{ base: "560px", md: "750px" }}
            bg="#0f172a"
            color="white"
          >
            <Box
              position="absolute"
              inset="0"
              bgImage={`url(${currentSlide.image})`}
              bgRepeat="no-repeat"
              bgPosition="center"
              bgSize="cover"
              opacity={0.72}
            />
            <Box
              position="absolute"
              inset="0"
              bg={`linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.34) 36%, rgba(15, 23, 42, 0.12) 62%, rgba(15, 23, 42, 0.22) 100%), linear-gradient(120deg, ${currentSlide.accent}0d 0%, transparent 58%)`}
            />

            <Flex
              position="relative"
              align="center"
              minH={{ base: "560px", md: "750px" }}
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
                    as="a"
                    href={currentSlide.ctaPrimary.href}
                    w={{ base: "100%", md: "auto" }}
                  >
                    {currentSlide.ctaPrimary.label}
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

              <Text
                fontSize="18px"
                color="#42506a"
                lineHeight="1.75"
              >
                Somos uma plataforma dedicada a aproximar estudantes, escolas e
                empresas, facilitando o acesso a oportunidades de Formacao em
                Contexto de Trabalho (FCT) e estagios.
              </Text>

              <Text
                fontSize="18px"
                color="#42506a"
                lineHeight="1.75"
              >
                Trabalhamos em parceria com instituicoes de ensino e entidades
                empregadoras para promover uma transicao mais simples, organizada
                e eficaz entre o percurso academico e o mercado de trabalho.
              </Text>

              <Text
                fontSize="18px"
                color="#42506a"
                lineHeight="1.75"
              >
                A nossa missao e contribuir para o desenvolvimento profissional
                dos jovens, proporcionando acesso a experiencias reais que
                valorizam competencias e potenciam a sua empregabilidade.
              </Text>

              <Text
                fontSize="18px"
                color="#42506a"
                lineHeight="1.75"
              >
                Simplificamos todo o processo, desde a ligacao entre escolas e
                empresas, a gestao de candidaturas e acompanhamento dos estagios,
                atraves de uma solucao digital intuitiva e acessivel.
              </Text>
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
              {growthHighlights.map((item) => (
                <Box
                  key={item.title}
                  flex="1"
                  bg="white"
                  borderRadius="24px"
                  px={{ base: 6, md: 8 }}
                  py={{ base: 7, md: 8 }}
                  textAlign="left"
                  boxShadow="0 10px 28px rgba(15, 23, 42, 0.09)"
                >
                  <Text
                    fontSize="20px"
                    fontWeight="bold"
                    color="#172036"
                    lineHeight="1.2"
                    mb={3}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize="16px"
                    lineHeight="1.45"
                    color="#5b6980"
                  >
                    {item.description}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>

          <Box id="como-funciona" bg="white" py={{ base: 16, md: 20 }}>
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
                  Um processo simples e acompanhado que liga estudantes, escolas
                  e empresas, criando oportunidades reais de desenvolvimento
                  profissional.
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
                    display="flex"
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
                      h="100%"
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
            id="para-estudantes"
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
                  Dê o primeiro passo na sua carreira com oportunidades reais de
                  FCT e estágios.
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
                      src={imagem5}
                      alt="Estudantes a consultar oportunidades na plataforma"
                      w="100%"
                      h={{ base: "250px", md: "310px" }}
                      objectFit="cover"
                      bg="#f8fbff"
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
                    A sua primeira experiência profissional
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Se é estudante de uma escola parceira, pode aceder à
                    plataforma NIPEE e candidatar-se a oportunidades de FCT e
                    estágios de forma simples e rápida.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Disponibilizamos oportunidades em diversas áreas, como
                    tecnologia, saúde, comércio, educação e muito mais,
                    permitindo-lhe escolher o caminho que melhor se adapta ao seu
                    perfil e objetivos.
                  </Text>

                  <Box
                    w="100%"
                    bg="#dbeafe"
                    borderLeft="4px solid #155dfc"
                    borderRadius="8px"
                    p={{ base: 5, md: 6 }}
                  >
                    <Text
                      fontSize="16px"
                      fontWeight="bold"
                      color="#172036"
                      mb={3}
                    >
                      Requisitos para participar:
                    </Text>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="16px" color="#155dfc">
                        - Estar matriculado numa escola parceira
                      </Text>
                      <Text fontSize="16px" color="#155dfc">
                        - Ter idade compatível com o programa
                      </Text>
                      <Text fontSize="16px" color="#155dfc">
                        - Disponibilidade para cumprir o horário definido
                      </Text>
                      <Text fontSize="16px" color="#155dfc">
                        - Compromisso e responsabilidade no percurso formativo
                      </Text>
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
                    flex={{
                      base: "1 1 100%",
                      md: "1 1 calc(50% - 28px)",
                      lg: "1 1 calc(33.333% - 28px)",
                    }}
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

          <Box
            id="para-empresas"
            bg="white"
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
                  Para Empresas
                </Box>
                <Text
                  maxW="700px"
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.65"
                  color="#52617a"
                >
                  Ligue a sua empresa a estudantes qualificados e simplifique a
                  gestão de estágios e FCT.
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
                    Junte-se à nossa rede de empresas parceiras
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    A NIPEE facilita a ligação entre empresas e estudantes,
                    permitindo encontrar candidatos alinhados com as suas
                    necessidades de forma simples e eficiente.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Através da nossa plataforma, pode gerir oportunidades,
                    acompanhar candidaturas e selecionar os perfis mais
                    adequados, com total transparência e controlo.
                  </Text>

                </VStack>

                <Box flex="1" w="100%">
                  <Box
                    overflow="hidden"
                    borderRadius="14px"
                    boxShadow="0 24px 50px rgba(15, 23, 42, 0.16)"
                  >
                    <Box
                      as="img"
                      src={imagem6}
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
                    flex={{
                      base: "1 1 100%",
                      md: "1 1 calc(50% - 28px)",
                      lg: "1 1 calc(33.333% - 28px)",
                    }}
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
                  Pronto para encontrar novos talentos?
                </Box>
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  mb={7}
                  color="whiteAlpha.900"
                >
                  Junte-se à NIPEE e ligue a sua empresa a estudantes
                  qualificados de forma simples e eficiente.
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
                  _hover={{
                    bg: "rgba(255,255,255,0.92)",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease"
                >
                  Tornar-se Empresa Parceira
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            id="para-escolas"
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
                  Proporcione aos seus alunos acesso a oportunidades de Formação
                  em Contexto de Trabalho (FCT) e estágios, de forma simples e
                  acompanhada.
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
                      src={imagem7}
                      alt="Ambiente escolar parceiro"
                      w="100%"
                      h={{ base: "280px", md: "405px" }}
                      objectFit="cover"
                      opacity={0.86}
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
                    Torne-se uma escola parceira
                  </Box>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    Ao integrar a rede NIPEE, a sua instituição passa a ter
                    acesso a uma plataforma que facilita a ligação entre alunos e
                    empresas, promovendo uma transição mais estruturada para o
                    mercado de trabalho.
                  </Text>

                  <Text fontSize="16px" lineHeight="1.75" color="#42506a">
                    A nossa equipa acompanha todo o processo de integração,
                    garantindo uma implementação ajustada às necessidades da
                    escola.
                  </Text>

                  <Box
                    w="100%"
                    bg="white"
                    border="1px solid #bfdbfe"
                    borderRadius="10px"
                    p={{ base: 5, md: 6 }}
                  >
                    <Text
                      fontSize="16px"
                      fontWeight="bold"
                      color="#172036"
                      mb={4}
                    >
                      Como funciona para a escola:
                    </Text>
                    <VStack align="start" spacing={3}>
                      {schoolProcess.map((item, index) => (
                        <Flex key={item.title} align="start" gap={3}>
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
                          <Box>
                            <Text
                              fontSize="15px"
                              fontWeight="bold"
                              color="#172036"
                            >
                              {item.title}
                            </Text>
                            <Text fontSize="15px" color="#42506a">
                              {item.description}
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  <Button
                    as="a"
                    href="/#contato"
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
                    Solicitar adesão
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
                    flex={{
                      base: "1 1 100%",
                      md: "1 1 calc(50% - 28px)",
                      lg: "1 1 calc(33.333% - 28px)",
                    }}
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
