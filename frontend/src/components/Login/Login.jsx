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
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  Icon,
  Alert,
  AlertIcon,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogin, isLoading, authError } from '../../store/ducks/auth';
import logo from '/src/images/logo.png';
import ReCAPTCHA from "react-google-recaptcha";

const avatars = [
  {
    name: 'Ryan Florence',
    url: 'https://avatars3.githubusercontent.com/u/100200?s=460&v=4',
  },
  {
    name: 'Kent Dodds',
    url: 'https://avatars0.githubusercontent.com/u/1500684?s=460&v=4',
  },
  {
    name: 'Prosper Otemuyiwa',
    url: 'https://miro.medium.com/max/1000/1*tv9pIQPhwumDnYBfCoapYg.jpeg',
  },
  {
    name: 'Christian Nwamba',
    url: 'https://avatars.githubusercontent.com/u/8108337?v=3&s=400',
  },
];

const Login = ({ isLoading, handleLogin, authError }) => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && recaptchaToken) {
      handleLogin(username, password);
    }
  };
  
  return (
    <Box position="relative">
      <Container
        as={SimpleGrid}
        maxW="7xl"
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Box textAlign="center">
            <a href="/">
            <img src={logo} alt="Logo NIPEE" style={{ width: '470px', margin: '0 auto' }} />
            </a>
          </Box>

          <Heading
            lineHeight={1.1}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
          >
            Menos burocracia{' '}
            <Text
              as="span"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              bgClip="text"
            >
              &amp;
            </Text>{' '}
            muitas opções de FCT/Estágio
          </Heading>
          <Stack direction="row" spacing={4} align="center">
            <AvatarGroup>
              {avatars.map((avatar) => (
                <Avatar
                  key={avatar.name}
                  name={avatar.name}
                  src={avatar.url}
                  size={useBreakpointValue({ base: 'md', md: 'lg' })}
                  position="relative"
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: 'full',
                    height: 'full',
                    rounded: 'full',
                    transform: 'scale(1.125)',
                    bgGradient: 'linear(to-bl, #5931E9, #7289FF)',
                    position: 'absolute',
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
              ))}
            </AvatarGroup>
            <Text fontFamily="heading" fontSize={{ base: '4xl', md: '6xl' }}>
              +
            </Text>
            <Flex
              align="center"
              justify="center"
              fontFamily="heading"
              fontSize={{ base: 'sm', md: 'lg' }}
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              rounded="full"
              width={useBreakpointValue({ base: '44px', md: '60px' })}
              height={useBreakpointValue({ base: '44px', md: '60px' })}
              position="relative"
              _before={{
                content: '""',
                width: 'full',
                height: 'full',
                rounded: 'full',
                transform: 'scale(1.125)',
                bgGradient: 'linear(to-bl, #7289FF, #5931E9)',
                position: 'absolute',
                zIndex: -1,
                top: 0,
                left: 0,
              }}
            >
              Você
            </Flex>
          </Stack>
        </Stack>
        <Stack
          bg="white"
          rounded="xl"
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: 'lg' }}
          boxShadow="xl"
        >
          <Stack spacing={4}>
            <Heading
              color="gray.800"
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            >
              Junte-se a nós
              <Text
                as="span"
                bgGradient="linear(to-r, #5931E9, #7289FF)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'sm', sm: 'md' }}>
              Estamos à procura pessoas incríveis como tu! Faça parte da nossa equipa e cresça como nunca!
            </Text>
          </Stack>
          {authError && (
            <Alert status="error" variant="left-accent" mt="1">
              <AlertIcon />
              {authError}
            </Alert>
          )}

          <Box as="form" mt={10}>
            <Stack spacing={4}>
              <FormControl>
                <Input
                  id="email"
                  placeholder="E-mail"
                  bg="gray.100"
                  border={0}
                  color="gray.600"
                  _placeholder={{ color: 'gray.500' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </FormControl>

              <InputGroup>
                <Input
                  id="password"
                  autoComplete="password"
                  placeholder="Palavra-passe"
                  bg="gray.100"
                  border={0}
                  type={showPassword ? "text" : "password"}
                  color="gray.600"
                  _placeholder={{ color: "gray.500" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Mostrar/ocultar senha"
                    icon={showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    variant="ghost"
                    onClick={togglePasswordVisibility}
                  />
                </InputRightElement>
              </InputGroup>
              
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
            </Stack>

            <Button
              fontFamily="heading"
              mt={8}
              w="full"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              _hover={{ bgGradient: 'linear(to-r, #7289FF, #5931E9)', boxShadow: 'xl' }}
              isLoading={isLoading}
              isDisabled={!username || !password || !recaptchaToken}
              onClick={() => handleLogin(username, password)}
            >
              Acessar
            </Button>
          </Box>

          <Stack spacing={4} mt={4}>
            <Button
              variant="link"
              color="blue.500"
              onClick={() => navigate('/recupera-senha')}
            >
              Esqueceu-se da palavra-passe?
            </Button>
            <Button
              variant="link"
              color="blue.500"
              onClick={() => navigate('/#registrar')}
            >
              Registar
            </Button>
            <Button
              variant="link"
              color="blue.500"
              onClick={() => navigate('/')}
            >
              Voltar ao início
            </Button>
          </Stack>
        </Stack>
      </Container>
      <Blur
        position="absolute"
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  );
};

export const Blur = (props) => (
  <Icon
    width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
    zIndex={-1}
    height="560px"
    viewBox="0 0 528 560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="71" cy="61" r="111" fill="#5931E9" />
    <circle cx="244" cy="106" r="139" fill="#7289FF" />
    <circle cy="291" r="139" fill="#5931E9" />
    <circle cx="80.5" cy="189.5" r="101.5" fill="#7289FF" />
    <circle cx="196.5" cy="317.5" r="101.5" fill="#5931E9" />
    <circle cx="70.5" cy="458.5" r="101.5" fill="#7289FF" />
    <circle cx="426.5" cy="-0.5" r="101.5" fill="#5931E9" />
  </Icon>
);

const mapStateToProps = (state) => ({
  isLoading: isLoading(state),
  authError: authError(state),
});

export default connect(mapStateToProps, { handleLogin })(Login);
