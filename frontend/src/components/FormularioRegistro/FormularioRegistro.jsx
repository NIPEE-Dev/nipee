import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  HStack,
  Stack,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { Select as ReactSelect } from "chakra-react-select";
import useCompanyPreRegistrations from "../../hooks/useCompanyPreRegistrations";
import useStudentPreRegistrations from "../../hooks/useStudentPreRegistrations";
import { nifValidator, phoneValidator } from "../../utils/formValidators";
import ReactInputMask from "react-input-mask";
import api from "../../api";

const FormularioRegistro = () => {
  const { addCompanyPreRegistration } = useCompanyPreRegistrations();
  const { addStudentPreRegistration } = useStudentPreRegistrations();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = useState("aluno");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState([]);
  const [records, setCourses] = useState([]);
  const [errors, setErrors] = useState({ empresa: {}, aluno: {} });
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const schoolOptions = schools.map(s => ({
    value: s.id,
    label: s.fantasy_name,
  }));
  
  const [formData, setFormData] = useState({
    empresa: {
      company_name: "",
      nif: "",
      representative_name: "",
      corporate_email: "",
      phone: "",
      sector: "",
      student_vacancies: "",
      message: "",
    },
    aluno: {
      full_name: "",
      birth_date: "",
      nif: "",
      email: "",
      phone: "",
      education_level: "",
      school_id: "",
      course: "",
      volunteer_experience: "",
      resume: null,
    },
  });

  const today = new Date();
  const minus_100_years = new Date();
  minus_100_years.setFullYear(today.getFullYear() - 100);
  const minus_100_years_from_today = minus_100_years.toISOString().split("T")[0];
  const minus_12_years = new Date();
  minus_12_years.setFullYear(today.getFullYear() - 12);
  const minus_12_years_from_today = minus_12_years.toISOString().split("T")[0];

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSchoolChange = (e) => {
    setCourses([])
    const selectedSchoolId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      aluno: {
        ...prev.aluno,
        school_id: selectedSchoolId,
        course: "",
      },
    }));
  };

  useEffect(() => {
    const fetchAllSchools = async () => {
      let allSchools = [];
      let currentPage = 1;
      let lastPage = 1;

      try {
        do {
          const res = await api.get(`/schools?page=${currentPage}`);
          allSchools = [...allSchools, ...res.data.data];
          lastPage = res.data.meta.last_page;
          currentPage++;
        } while (currentPage <= lastPage);

        setSchools(allSchools);
      } catch (error) {
        console.error("Erro ao buscar as escolas:", error);
      }
    };

    fetchAllSchools();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!formData.aluno.school_id) {
        setCourses([]);
        return;
      }

      let allCourses = [];
      let currentPage = 1;
      let lastPage = 1;

      try {
          const res = await api.get(
            `/schools/${formData.aluno.school_id}/courses`
          );
          allCourses = res.data.data;

        setCourses(allCourses);
        console.log(allCourses);
      } catch (error) {
        console.error("Erro ao buscar os cursos:", error);
      }
    };

    fetchCourses();
  }, [formData.aluno.school_id]);

  const handleInputChange = (e, type) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Tamanho do arquivo excede o limite!",
          description: "O arquivo deve ter no máximo 10MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            [name]: base64String,
          },
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [name]: value,
        },
      }));

      if (name === "nif") {
        const errorMessage = nifValidator(value, true);
        setErrors((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            nif: errorMessage,
          },
        }));
      }

      if (name === "phone") {
        const errorMessage = phoneValidator(value, true);
        setErrors((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            phone: errorMessage,
          },
        }));
      }
    }
  };

  const handleClearForm = () => {
    setFormData((prev) => ({
      ...prev,
      [formType]: Object.keys(prev[formType]).reduce((acc, key) => {
        acc[key] = key === "arquivo" ? null : "";
        return acc;
      }, {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (formType === "empresa") {
        result = await addCompanyPreRegistration(formData);
      } else {
        result = await addStudentPreRegistration(formData);
      }
      if (result && result.status === 201) {
        toast({
          title: "Registo efetuado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onOpen();
        handleClearForm();
      } else {
        toast({
          title: "Erro ao registar!",
          description: result?.message || "Ocorreu um erro durante o registo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao registar!",
        description: error.message || "Ocorreu um erro durante o registo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFormData = formData[formType];
  const currentErrors = errors[formType];

  return (
    <Box
      bg="white"
      p={10}
      maxWidth="1000px"
      mx="auto"
      borderRadius="md"
      boxShadow="lg"
      id="registrar"
    >
      <Heading
        as="h2"
        size="lg"
        textAlign="center"
        mb={8}
        bgGradient="linear(to-r, #5931E9, #7289FF)"
        bgClip="text"
        fontWeight="bold"
      >
        Faça o seu registo
      </Heading>

      {/* Botões de seleção */}
      <Flex justifyContent="center" mb={8} wrap="wrap">
        <Button
          variant={formType === "aluno" ? "solid" : "outline"}
          color={formType === "aluno" ? "white" : "#5931E9"}
          bg={formType === "aluno" ? "#5931E9" : "transparent"}
          borderColor="linear(to-r, #7289FF, #5931E9)"
          fontWeight="bold"
          _hover={{
            bgGradient: "linear(to-r, #7289FF, #5931E9)",
            color: "white",
          }}
          px={6}
          mr={4}
          py={3}
          onClick={() => setFormType("aluno")}
        >
          Candidato
        </Button>
        <Button
          variant={formType === "empresa" ? "solid" : "outline"}
          color={formType === "empresa" ? "white" : "#5931E9"}
          bg={formType === "empresa" ? "#5931E9" : "transparent"}
          borderColor="purple.400"
          fontWeight="bold"
          _hover={{
            bgGradient: "linear(to-r, #7289FF, #5931E9)",
            color: "white",
          }}
          px={6}
          py={3}
          onClick={() => setFormType("empresa")}
        >
          Empresa
        </Button>
      </Flex>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {formType === "empresa" ? (
            <>
              {/* Campos específicos para empresas */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Nome da Entidade</FormLabel>
                  <Input
                    name="company_name"
                    value={currentFormData.company_name}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Digite o nome da Entidade"
                    bg="gray.50"
                  />
                </FormControl>
                <FormControl isRequired isInvalid={!!currentErrors.nif}>
                  <FormLabel>NIPC (Número de Identificação de Pessoa Coletiva)</FormLabel>
                  <Input
                    name="nif"
                    type="text"
                    maxLength={9}
                    value={currentFormData.nif}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Digite o NIPC"
                    bg="gray.50"
                  />
                  {currentErrors.nif && (
                    <FormErrorMessage>{currentErrors.nif}</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Representante da Entidade</FormLabel>
                  <Input
                    name="representative_name"
                    value={currentFormData.representative_name}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Digite o nome do representante"
                    bg="gray.50"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>E-mail corporativo</FormLabel>
                  <Input
                    name="corporate_email"
                    type="email"
                    value={currentFormData.corporate_email}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Digite o e-mail corporativo"
                    bg="gray.50"
                  />
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl>
                  <FormLabel>Telemóvel</FormLabel>
                  <ReactInputMask
                    mask="+351 999 999 999"
                    value={formData.empresa.phone}
                    onChange={(e) => handleInputChange(e, "empresa")}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        name="phone"
                        type="text"
                        placeholder="Digite o telemóvel"
                        bg="gray.50"
                      />
                    )}
                  </ReactInputMask>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Setor de atuação</FormLabel>
                  <Select
                    name="sector"
                    value={currentFormData.sector}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Selecione o setor de atuação"
                    bg="gray.50"
                  >
                    <option value="TI">TI</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Comércio">Comércio</option>
                    <option value="Outro">Outro</option>
                  </Select>
                </FormControl>
              </Stack>
              <FormControl>
                <FormLabel>
                  Descreva em poucas palavras o ramo de atividade de sua empresa
                </FormLabel>
                <Textarea
                  name="message"
                  value={currentFormData.message}
                  onChange={(e) => handleInputChange(e, "empresa")}
                  placeholder="Escreva sua mensagem"
                  bg="gray.50"
                />
              </FormControl>
            </>
          ) : (
            <>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Nome completo</FormLabel>
                  <Input
                    name="full_name"
                    value={currentFormData.full_name}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Digite seu nome completo"
                    bg="gray.50"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Data de nascimento</FormLabel>
                  <Input
                    name="birth_date"
                    type="date"
                    value={currentFormData.birth_date}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    bg="gray.50"
                    min={minus_100_years_from_today}
                    max={minus_12_years_from_today}
                  />
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    name="email"
                    value={currentFormData.email}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Digite seu e-mail"
                    bg="gray.50"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telemóvel para contacto</FormLabel>
                  <ReactInputMask
                    mask="+351 999 999 999"
                    value={formData.aluno.phone}
                    onChange={(e) => handleInputChange(e, "aluno")}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        name="phone"
                        type="text"
                        placeholder="Digite o telemóvel"
                        bg="gray.50"
                      />
                    )}
                  </ReactInputMask>
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Nível de Ensino atual</FormLabel>
                  <Select
                    name="education_level"
                    value={currentFormData.education_level}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Selecione uma opção"
                    bg="gray.50"
                  >
                    <option value="E">
                      Cursos Profissionais Nível 4 / Ensino Secundário
                    </option>
                    <option value="CP5">
                      Cursos Profissionais CET - Nível 5
                    </option>
                    <option value="TS">Ensino Superior TESP - Nível 5</option>
                  </Select>
                </FormControl>
                <FormControl isRequired isInvalid={!!currentErrors.nif}>
                  <FormLabel>NIF (Número de Identificação Fiscal)</FormLabel>
                  <Input
                    name="nif"
                    type="text"
                    maxLength={9}
                    value={currentFormData.nif}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Digite o NIF"
                    bg="gray.50"
                  />
                  {currentErrors.nif && (
                    <FormErrorMessage>{currentErrors.nif}</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl isRequired>
                <FormLabel>Escola</FormLabel>
                <ReactSelect
                  name="school_id"
                  options={schoolOptions}
                  value={schoolOptions.find(o => o.value === currentFormData.school_id) || null}
                  onChange={(option) => {
                  const selectedId = option?.value || "";
                    setFormData(prev => ({
                      ...prev,
                      aluno: {
                        ...prev.aluno,
                        school_id: selectedId,
                        course: "",
                      },
                    }));
                  }}
                  placeholder="Selecione ou escreva uma opção"
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      background: "gray.50"
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      background: "gray.50"
                    }),
                  }}
                  isClearable
                />
              </FormControl>
              <FormControl isRequired>
                   <FormLabel>Curso</FormLabel>
                   <Select
                     name="course"
                     value={currentFormData.course}
                     onChange={(e) => handleInputChange(e, "aluno")}
                     placeholder="Selecione uma opção"
                     isDisabled={!currentFormData.school_id || records.length === 0}
                     bg="gray.50"
                   >
                     {records.map((record) => (
                       <option key={record.id} value={record.id}>
                         {record.title}
                       </option>
                     ))}
                   </Select>
                 </FormControl>
              </Stack>
              <FormControl>
                <FormLabel>
                  Participa ou participou de voluntariado? Descreva
                </FormLabel>
                <Textarea
                  name="volunteer_experience"
                  value={currentFormData.volunteer_experience}
                  onChange={(e) => handleInputChange(e, "aluno")}
                  placeholder="Descreva sua experiência"
                  bg="gray.50"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Anexar Currículo (CV)</FormLabel>
                <Input
                  name="resume"
                  type="file"
                  onChange={(e) => handleInputChange(e, "aluno")}
                  bg="gray.50"
                />
              </FormControl>
            </>
          )}
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
          <Flex justify="space-between" mt={6} wrap="wrap">
            <Button
              variant="outline"
              colorScheme="gray"
              px={6}
              py={3}
              onClick={handleClearForm}
            >
              Limpar Formulário
            </Button>
            <Button
              fontWeight="bold"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
              py={3}
              type="submit"
              isDisabled={!recaptchaToken}
              isLoading={isSubmitting}
              loadingText="Enviando..."
            >
              Efetuar Registo
            </Button>
          </Flex>
        </VStack>
      </form>

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
            🎉 Registo Realizado!
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
                Seu registo foi efetuado com sucesso!
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

export default FormularioRegistro;
