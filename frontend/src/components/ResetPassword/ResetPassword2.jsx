import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Heading, Text, Container, Input, Button, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import useChangePassword from '../../hooks/useChangePassword';
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword2 = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [email, setEmail] = useState('');

  const handleRecaptchaChange = (token) => {
      setRecaptchaToken(token);
  };

  const { changeUserPassword, loading, error, successMessage: hookSuccessMessage } = useChangePassword();
  const navigate = useNavigate(); 

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
  
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const response = await changeUserPassword(email, newPassword, confirmPassword);
      if (response.status === 200) {
        setSuccessMessage(hookSuccessMessage || 'Senha redefinida com sucesso!');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao redefinir a senha. Tente novamente.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [successMessage, navigate]); 

  {successMessage && (
    <Alert status="success" variant="left-accent">
      <AlertIcon />
      {successMessage}
    </Alert>
  )}
  
  {errorMessage && (
    <Alert status="error" variant="left-accent">
      <AlertIcon />
      {errorMessage}
    </Alert>
  )}
  
  return (
    <Box position="relative" bg="gray.50" minH="100vh" display="flex" alignItems="center">
      <Container
        bg="white"
        rounded="xl"
        p={{ base: 6, sm: 8 }}
        boxShadow="xl"
        maxW={{ base: 'md', lg: 'lg' }}
      >
        <Stack spacing={4}>
          <Heading
            color="gray.800"
            lineHeight={1.1}
            fontSize={{ base: '2xl', sm: '3xl' }}
            textAlign="center"
          >
            Defina a sua senha
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'sm', sm: 'md' }} textAlign="center">
            Criar a sua nova senha.
          </Text>

          {successMessage && (
            <Alert status="success" variant="left-accent">
              <AlertIcon />
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert status="error" variant="left-accent">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}

          <Box as="form">
            <Stack spacing={4}>
 
            <FormControl>
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.100"
                border={0}
                placeholder="Digite seu e-mail"
                _placeholder={{ color: 'gray.500' }}
              />
            </FormControl>

              <FormControl>
                <FormLabel>Nova senha</FormLabel>
                <Input
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg="gray.100"
                  border={0}
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Confirmar nova senha</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="gray.100"
                  border={0}
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>
            </Stack>

            <Button
              fontFamily="heading"
              my={8}
              w="full"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, #7289FF, #5931E9)',
                boxShadow: 'xl',
              }}
              isDisabled={!recaptchaToken}
              onClick={handleResetPassword}
              isLoading={loading}
            >
              Redefinir senha
            </Button>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleRecaptchaChange}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPassword2;
