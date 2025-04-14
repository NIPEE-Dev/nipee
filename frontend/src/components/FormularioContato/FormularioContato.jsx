import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";

const FormularioContato = () => {
  const toast = useToast();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleClearForm = () => {
    setFormData({
      nome: "",
      email: "",
      assunto: "",
      mensagem: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onOpen();
    handleClearForm();
  };

  return (
    <Box bg="white" py={10} px={{ base: 4, md: 8 }} textAlign="center" id="contato">
      <Heading
        as="h2"
        fontSize={{ base: "2xl", md: "3xl" }}
        color="#5931E9"
        mb={4}
      >
        Exponha as suas dúvidas
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={8}>
        Responderemos tão breve quanto possível
      </Text>
      <Box
        maxW="800px"
        mx="auto"
        bg="white"
        boxShadow="lg"
        p={6}
        rounded="md"
      >
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o seu nome"
                bg="gray.50"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>E-mail</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o seu e-mail"
                bg="gray.50"
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6} mt={4}>
            <FormControl isRequired>
              <FormLabel>Assunto</FormLabel>
              <Input
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                placeholder="Digite o assunto"
                bg="gray.50"
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6} mt={4}>
            <FormControl isRequired>
              <FormLabel>Mensagem</FormLabel>
              <Textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Digite a sua mensagem"
                bg="gray.50"
                rows={5}
              />
            </FormControl>
          </SimpleGrid>
          <Button
            type="submit"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            size="lg"
            w="full"
            my={6}
            isDisabled={!recaptchaToken}
          >
            Enviar
          </Button>

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </form>
      </Box>

      {/* Modal de sucesso */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bgGradient="linear(to-r, #5931E9, #7289FF)"
          color="white"
          borderRadius="lg"
          boxShadow="2xl"
          overflow="hidden"
          transform="scale(1.05)"
          transition="all 0.3s ease-in-out"
          mx={4}
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="white"
            mt={4}
          >
            🎉 Sua dúvida foi enviada!
          </ModalHeader>
          <ModalBody textAlign="center" py={6} px={8}>
            <Box
              bg="whiteAlpha.200"
              p={4}
              borderRadius="md"
              boxShadow="md"
              mb={4}
              textAlign="center"
            >
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                Sua mensagem foi enviada com sucesso!
              </Box>
              <Box fontSize="sm">
                Entraremos em contacto em breve. Fique atento no seu e-mail!
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center" pb={4}>
            <Button
              onClick={onClose}
              bg="white"
              color="#5931E9"
              fontWeight="bold"
              _hover={{
                bgGradient: "linear(to-r, #7289FF, #5931E9)",
                color: "white",
              }}
              _active={{ transform: "scale(0.95)" }}
              px={6}
              py={4}
              borderRadius="full"
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FormularioContato;
