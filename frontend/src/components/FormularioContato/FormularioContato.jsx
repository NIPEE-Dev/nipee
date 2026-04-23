import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Flex,
  VStack,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import useSendContact from "../../hooks/useSendContact";

const contactItems = [
  {
    icon: FaMapMarkerAlt,
    title: "Endereco",
    lines: ["Av. Principal, 1234", "Centro - Sao Paulo, SP", "CEP: 01000-000"],
  },
  {
    icon: FaPhoneAlt,
    title: "Telefone",
    lines: ["211 309 985", "912 485 534"],
  },
  {
    icon: FaEnvelope,
    title: "E-mail",
    lines: ["contacto@nipee.org", "inscricoes@nipee.org"],
  },
];

const FormularioContato = () => {
  const toast = useToast();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sendContact, loading } = useSendContact();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "Contato pelo site",
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
      telefone: "",
      assunto: "Contato pelo site",
      mensagem: "",
    });
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await sendContact(formData);

      if (success) {
        onOpen();
        handleClearForm();
      }
    } catch (err) {
      toast({
        title: err.message || "Erro ao enviar mensagem.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box id="contato" bg="white" py={{ base: 16, md: 20 }} px={{ base: 4, md: 8 }}>
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
            Entre em Contato
          </Box>
          <Text fontSize={{ base: "16px", md: "18px" }} color="#52617a">
            Estamos prontos para ajudar voce a dar o proximo passo
          </Text>
        </VStack>

        <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 10, lg: 16 }}>
          <Box flex="1">
            <Box
              as="h3"
              m={0}
              mb={8}
              fontSize={{ base: "24px", md: "28px" }}
              fontWeight="bold"
              color="#172036"
            >
              Informacoes de Contato
            </Box>

            <VStack align="stretch" spacing={8}>
              {contactItems.map((item) => (
                <Flex key={item.title} align="start" gap={4}>
                  <Flex
                    w="48px"
                    h="48px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="#dbeafe"
                    color="#155dfc"
                    flexShrink={0}
                  >
                    <Icon as={item.icon} boxSize="20px" />
                  </Flex>
                  <Box>
                    <Text fontSize="16px" fontWeight="bold" color="#172036" mb={2}>
                      {item.title}
                    </Text>
                    {item.lines.map((line) => (
                      <Text key={line} fontSize="16px" lineHeight="1.55" color="#52617a">
                        {line}
                      </Text>
                    ))}
                  </Box>
                </Flex>
              ))}

              <Box bg="#eaf3ff" borderRadius="12px" p={{ base: 5, md: 6 }} mt={4}>
                <Text fontSize="16px" fontWeight="bold" color="#172036" mb={3}>
                  Horario de Atendimento
                </Text>
                <Text fontSize="16px" color="#52617a">
                  Segunda a Sexta: 8h as 18h
                </Text>
                <Text fontSize="16px" color="#52617a">
                  Sabado: 9h as 13h
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box flex="1.05">
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="15px" fontWeight="semibold" color="#172036">
                    Nome Completo
                  </FormLabel>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    h="48px"
                    bg="white"
                    borderColor="#d9e0ea"
                    _focus={{ borderColor: "#155dfc", boxShadow: "0 0 0 1px #155dfc" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="15px" fontWeight="semibold" color="#172036">
                    E-mail
                  </FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    h="48px"
                    bg="white"
                    borderColor="#d9e0ea"
                    _focus={{ borderColor: "#155dfc", boxShadow: "0 0 0 1px #155dfc" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="15px" fontWeight="semibold" color="#172036">
                    Telefone
                  </FormLabel>
                  <Input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    h="48px"
                    bg="white"
                    borderColor="#d9e0ea"
                    _focus={{ borderColor: "#155dfc", boxShadow: "0 0 0 1px #155dfc" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="15px" fontWeight="semibold" color="#172036">
                    Mensagem
                  </FormLabel>
                  <Textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Como podemos ajudar?"
                    minH="120px"
                    bg="white"
                    borderColor="#d9e0ea"
                    _focus={{ borderColor: "#155dfc", boxShadow: "0 0 0 1px #155dfc" }}
                  />
                </FormControl>

                <Box>
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                  />
                </Box>

                <Button
                  type="submit"
                  bg="#155dfc"
                  color="white"
                  cursor="pointer"
                  h="54px"
                  borderRadius="full"
                  fontWeight="bold"
                  leftIcon={<Icon as={FaPaperPlane} />}
                  _hover={{ bg: "#0f4fd6", transform: "translateY(-1px)" }}
                  transition="all 0.2s ease"
                  isDisabled={!recaptchaToken}
                  isLoading={loading}
                  loadingText="Enviando..."
                >
                  Enviar Mensagem
                </Button>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent borderRadius="lg" boxShadow="2xl" mx={4}>
          <ModalHeader color="#172036" textAlign="center">
            Mensagem enviada!
          </ModalHeader>
          <ModalBody textAlign="center" color="#52617a" pb={6}>
            Sua mensagem foi enviada com sucesso. Entraremos em contacto em breve.
          </ModalBody>
          <ModalFooter justifyContent="center" pb={5}>
            <Button
              onClick={onClose}
              bg="#155dfc"
              color="white"
              _hover={{ bg: "#0f4fd6" }}
              borderRadius="full"
              px={8}
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
