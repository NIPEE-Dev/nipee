import React, { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Icon,
  Alert,
  AlertIcon,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import {
  FaArrowLeft,
  FaBriefcase,
  FaCheckCircle,
  FaSchool,
  FaUserGraduate,
} from 'react-icons/fa';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleLogin, isLoading, authError } from '../../store/ducks/auth';
import logo from '/src/images/logo.png';
import loginImage from '../../images/slide2.jpg';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../Navbar/Navbar';
import FooterHome from '../Footer/FooterHome';

const loginHighlights = [
  {
    icon: FaUserGraduate,
    title: 'Estudantes',
    description: 'Candidate-se a oportunidades de FCT e estágios profissionais em poucos passos.',
  },
  {
    icon: FaSchool,
    title: 'Escolas',
    description: 'Acompanhe alunos, candidaturas e progresso numa única plataforma.',
  },
  {
    icon: FaBriefcase,
    title: 'Empresas',
    description: 'Encontre talento jovem e simplifique a gestão de FCT.',
  },
];

const Login = ({ isLoading, handleLogin, authError }) => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect');
  const canSubmit = Boolean(username && password && recaptchaToken);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const submitLogin = () => {
    if (canSubmit) {
      handleLogin(username, password, redirectTo);
    }
  };

  return (
    <>
      <Box minH="100vh" bg="#F9FAFB" position="relative" overflow="hidden">
        <Navbar />
        <Box
          position="absolute"
          inset="0"
          bg="radial-gradient(circle at 12% 18%, rgba(21, 93, 252, 0.12), transparent 28%), radial-gradient(circle at 88% 12%, rgba(15, 118, 110, 0.12), transparent 24%)"
          pointerEvents="none"
        />

        <Container
          as={SimpleGrid}
          maxW="1200px"
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 8, lg: 14 }}
          alignItems="center"
          minH="calc(100vh - 96px)"
          pt={{ base: 28, md: 32 }}
          pb={{ base: 10, md: 14 }}
          position="relative"
          zIndex={1}
        >
          <Box>
            <Box
              overflow="hidden"
              borderRadius={{ base: '20px', md: '28px' }}
              minH={{ base: '420px', md: '660px' }}
              position="relative"
              bg="#0f172a"
              color="white"
              boxShadow="0 24px 50px rgba(15, 23, 42, 0.16)"
            >
              <Box
                position="absolute"
                inset="0"
                bgImage={`url(${loginImage})`}
                bgRepeat="no-repeat"
                bgPosition="center"
                bgSize="cover"
                opacity={0.78}
              />
              <Box
                position="absolute"
                inset="0"
                bg="linear-gradient(90deg, rgba(15, 23, 42, 0.66) 0%, rgba(15, 23, 42, 0.42) 50%, rgba(15, 23, 42, 0.2) 100%)"
              />

              <VStack
                align="start"
                justify="space-between"
                position="relative"
                minH={{ base: '420px', md: '660px' }}
                p={{ base: 6, md: 10 }}
                spacing={8}
              >
                <Box as="a" href="/" display="inline-block">
                  <Box
                    as="img"
                    src={logo}
                    alt="Logo NIPEE"
                    w={{ base: '160px', md: '190px' }}
                    bg="white"
                    borderRadius="14px"
                    px={4}
                    py={3}
                    boxShadow="0 12px 28px rgba(15, 23, 42, 0.18)"
                  />
                </Box>

                <Stack spacing={6} maxW="590px">
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                    color="whiteAlpha.800"
                  >
                    Plataforma NIPEE
                  </Text>
                  <Heading
                    as="h1"
                    fontSize={{ base: '34px', md: '54px' }}
                    lineHeight={{ base: '1.08', md: '1' }}
                    letterSpacing="0"
                    color="white"
                  >
                    Entre na sua área e continue a ligar talento ao mercado.
                  </Heading>
                  <Text
                    fontSize={{ base: '16px', md: '18px' }}
                    lineHeight="1.65"
                    color="whiteAlpha.900"
                    maxW="560px"
                  >
                    Aceda para gerir candidaturas, acompanhar FCT e manter
                    escolas, empresas e estudantes no mesmo fluxo.
                  </Text>
                </Stack>

                <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} w="100%">
                  {loginHighlights.map((item) => (
                    <Box
                      key={item.title}
                      bg="rgba(255,255,255,0.14)"
                      border="1px solid rgba(255,255,255,0.22)"
                      borderRadius="14px"
                      p={4}
                      flex="1"
                      backdropFilter="blur(12px)"
                    >
                      <Flex
                        w="42px"
                        h="42px"
                        align="center"
                        justify="center"
                        borderRadius="full"
                        bg="rgba(255,255,255,0.18)"
                        color="white"
                        mb={3}
                      >
                        <Icon as={item.icon} boxSize="19px" />
                      </Flex>
                      <Text fontWeight="bold" fontSize="16px" mb={2}>
                        {item.title}
                      </Text>
                      <Text fontSize="14px" lineHeight="1.45" color="rgba(255,255,255,0.86)">
                        {item.description}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </VStack>
            </Box>
          </Box>

          <Stack
            bg="white"
            borderRadius="16px"
            p={{ base: 6, sm: 8, md: 10 }}
            spacing={8}
            maxW={{ md: '540px' }}
            w="100%"
            justifySelf={{ md: 'end' }}
            boxShadow="0 20px 46px rgba(15, 23, 42, 0.12)"
            border="1px solid #e5e7eb"
          >
            <Stack spacing={3}>
              <Button
                variant="link"
                color="#155dfc"
                alignSelf="start"
                leftIcon={<FaArrowLeft />}
                onClick={() => navigate('/')}
                fontWeight="bold"
              >
                Voltar ao início
              </Button>
              <HStack spacing={2} color="#155dfc">
                <Icon as={FaCheckCircle} boxSize="16px" />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.16em"
                  textTransform="uppercase"
                >
                  Acesso seguro
                </Text>
              </HStack>
              <Heading
                color="#172036"
                lineHeight={1.1}
              fontSize={{ base: '30px', md: '38px' }}
              >
                Iniciar sessão
              </Heading>
              <Text color="#52617a" fontSize="16px" lineHeight="1.6">
                Use o seu e-mail e palavra-passe para continuar na plataforma.
              </Text>
            </Stack>

            {authError && (
              <Alert status="error" variant="left-accent" mt="1" borderRadius="10px">
                <AlertIcon />
                {authError === 'Unauthorized'
                  ? 'E-mail ou palavra-passe inválida'
                  : authError}
              </Alert>
            )}

            <Box
              as="form"
              onSubmit={(event) => {
                event.preventDefault();
                submitLogin();
              }}
            >
              <Stack spacing={5}>
                <FormControl>
                  <Text mb={2} fontSize="14px" fontWeight="bold" color="#172036">
                    E-mail
                  </Text>
                  <Input
                    id="email"
                    placeholder="exemplo@email.com"
                    bg="#F9FAFB"
                    border="1px solid #dbe1ea"
                    borderRadius="12px"
                    h="52px"
                    color="#172036"
                    _placeholder={{ color: '#7a869a' }}
                    _focus={{
                      borderColor: '#155dfc',
                      boxShadow: '0 0 0 3px rgba(21, 93, 252, 0.14)',
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <Text mb={2} fontSize="14px" fontWeight="bold" color="#172036">
                    Palavra-passe
                  </Text>
                  <InputGroup>
                    <Input
                      id="password"
                      autoComplete="password"
                      placeholder="A sua palavra-passe"
                      bg="#F9FAFB"
                      border="1px solid #dbe1ea"
                      borderRadius="12px"
                      h="52px"
                      pr="52px"
                      type={showPassword ? 'text' : 'password'}
                      color="#172036"
                      _placeholder={{ color: '#7a869a' }}
                      _focus={{
                        borderColor: '#155dfc',
                        boxShadow: '0 0 0 3px rgba(21, 93, 252, 0.14)',
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement h="52px">
                      <IconButton
                        aria-label="Mostrar/ocultar palavra-passe"
                        icon={showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                        variant="ghost"
                        color="#52617a"
                        onClick={togglePasswordVisibility}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Flex justify={{ base: 'center', sm: 'start' }} overflowX="auto" py={1}>
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                  />
                </Flex>
              </Stack>

              <Button
                type="submit"
                mt={8}
                w="full"
                h="52px"
                bg="#155dfc"
                color="white"
                borderRadius="full"
                fontWeight="bold"
                boxShadow="0 14px 30px rgba(21, 93, 252, 0.22)"
                _hover={{ bg: '#0f4fd6', transform: 'translateY(-1px)' }}
                _disabled={{
                  bg: '#9db8fb',
                  cursor: 'not-allowed',
                  boxShadow: 'none',
                  transform: 'none',
                }}
                transition="all 0.2s ease"
                isLoading={isLoading}
                isDisabled={!canSubmit}
              >
                Entrar
              </Button>
            </Box>

            <Stack spacing={4} pt={1}>
              <Button
                variant="link"
                color="#155dfc"
                onClick={() => navigate('/recupera-senha')}
                alignSelf="center"
              >
                Esqueceu-se da palavra-passe?
              </Button>
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                gap={3}
                align="center"
                justify="center"
                color="#52617a"
                fontSize="15px"
              >
                <Text>Ainda não tem conta?</Text>
                <Button
                  variant="link"
                  color="#155dfc"
                  onClick={() => navigate('/registar-candidato')}
                >
                  Registar candidato
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <FooterHome />
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: isLoading(state),
  authError: authError(state),
});

export default connect(mapStateToProps, { handleLogin })(Login);
