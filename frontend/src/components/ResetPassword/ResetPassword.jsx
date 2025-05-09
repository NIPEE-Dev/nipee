import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Heading, Text, Container, Input, Button, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import useChangePassword from '../../hooks/useChangePassword';
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailFromUrl = params.get('email'); 
  const navigate = useNavigate(); 

  const { sendVerification, changeUserPassword, loading, successMessage: hookSuccessMessage } = useChangePassword();

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl); 
    }
  }, [emailFromUrl]);

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (step === 1) {
        if (!email) return setErrorMessage('Digite o e-mail.');
        if (!recaptchaToken) return setErrorMessage('Complete o reCAPTCHA.');

        await sendVerification(email); 
        setStep(2);
      } else if (step === 2) {
        if (!verificationCode) return setErrorMessage('Digite o código de verificação.');
        setStep(3);
      } else if (step === 3) {
        if (!newPassword || !confirmPassword) return setErrorMessage('Preencha todos os campos.');
        if (newPassword !== confirmPassword) return setErrorMessage('As senhas não coincidem.');

        const response = await changeUserPassword(email, verificationCode, newPassword, confirmPassword);
        if (response.status === 200) {
          setSuccessMessage(hookSuccessMessage || 'Senha redefinida com sucesso!');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Ocorreu um erro.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [successMessage, navigate]);

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
            {step === 1 && 'Verifique seu e-mail'}
            {step === 2 && 'Insira o código enviado'}
            {step === 3 && 'Crie uma nova senha'}
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'sm', sm: 'md' }} textAlign="center">
            {step === 1 && 'Digite o e-mail associado à sua conta.'}
            {step === 2 && 'Digite o código que você recebeu no e-mail.'}
            {step === 3 && 'Escolha uma nova senha segura.'}
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
              {step === 1 && (
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.100"
                    border={0}
                    placeholder="Digite seu e-mail"
                    isReadOnly
                  />
                </FormControl>
              )}

              {step === 2 && (
                <FormControl>
                  <FormLabel>Código de verificação</FormLabel>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Código de 6 dígitos"
                    bg="gray.100"
                    border={0}
                  />
                </FormControl>
              )}

              {step === 3 && (
                <>
                  <FormControl>
                    <FormLabel>Nova senha</FormLabel>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha"
                      bg="gray.100"
                      border={0}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a senha"
                      bg="gray.100"
                      border={0}
                    />
                  </FormControl>
                </>
              )}
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
              onClick={handleSubmit}
              isLoading={loading}
            >
              {step === 1 && 'Enviar código'}
              {step === 2 && 'Validar código'}
              {step === 3 && 'Redefinir senha'}
            </Button>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPassword;
