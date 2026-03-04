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
  Checkbox,
  Text,
  Link,
  Divider,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { Select as ReactSelect } from "chakra-react-select";
import useCompanyPreRegistrations from "../../hooks/useCompanyPreRegistrations";
import useStudentPreRegistrations from "../../hooks/useStudentPreRegistrations";
import { nifValidator, phoneValidator } from "../../utils/formValidators";
import ReactInputMask from "react-input-mask";
import api from "../../api";
import { districtMap, districtsAndCities } from "../../utils/constants";
import { Link as RouterLink } from "react-router-dom";
import logo from "/src/images/logo.png";

const FormularioRegistro = () => {
  const { addCompanyPreRegistration } = useCompanyPreRegistrations();
  const { addStudentPreRegistration } = useStudentPreRegistrations();
  const toast = useToast();
  
  // Modal de Sucesso (o que você já tinha)
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Modal de Termos (Novo)
  const { 
    isOpen: isTermsOpen, 
    onOpen: onTermsOpen, 
    onClose: onTermsClose 
  } = useDisclosure();

  const [formType, setFormType] = useState("aluno");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConsented, setHasConsented] = useState(false); // Estado para o checkbox
  const [schools, setSchools] = useState([]);
  const [districts] = useState(
    Object.keys(districtsAndCities).map((element) => ({
      value: element,
      label: element,
    }))
  );
  const [schoolLocation, setSchoolLocation] = useState({
    district: null,
    city: null,
  });
  const [records, setCourses] = useState([]);
  const [errors, setErrors] = useState({ empresa: {}, aluno: {} });
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const schoolOptions = schools.map((s) => ({
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
  const minus_100_years_from_today = minus_100_years
    .toISOString()
    .split("T")[0];
  const minus_12_years = new Date();
  minus_12_years.setFullYear(today.getFullYear() - 12);
  const minus_12_years_from_today = minus_12_years.toISOString().split("T")[0];

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSchoolChange = (e) => {
    setCourses([]);
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

  const citiesOptions =
    schoolLocation.district === null
      ? []
      : districtsAndCities[schoolLocation.district].map((element) => ({
          label: element,
          value: element,
        }));
  const selectedCity = citiesOptions.find(
    (element) => element.value === schoolLocation.city
  );

  const fetchAllSchools = async () => {
    let allSchools = [];
    let currentPage = 1;
    let lastPage = 1;

    try {
      do {
        const res = await api.get(`/schools`, {
          params: {
            currentPage,
            perPage: 99,
            district: schoolLocation.district
              ? districtMap[schoolLocation.district]
              : null,
            city: schoolLocation.city,
          },
        });
        allSchools = [...allSchools, ...res.data.data];
        lastPage = res.data.meta.last_page;
        currentPage++;
      } while (currentPage <= lastPage);

      setSchools(allSchools);
    } catch (error) {
      console.error("Erro ao buscar as escolas:", error);
    }
  };

  useEffect(() => {
    fetchAllSchools();
  }, []);

  useEffect(() => {
    fetchAllSchools();
  }, [schoolLocation]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!formData.aluno.school_id) {
        setCourses([]);
        return;
      }

      try {
        const res = await api.get(
          `/schools/${formData.aluno.school_id}/courses`
        );
        setCourses(res.data.data);
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
        setFormData((prev) => ({
          ...prev,
          [type]: { ...prev[type], [name]: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: { ...prev[type], [name]: value },
      }));

      if (name === "nif") {
        const errorMessage = nifValidator(value, true);
        setErrors((prev) => ({
          ...prev,
          [type]: { ...prev[type], nif: errorMessage },
        }));
      }

      if (name === "phone") {
        const errorMessage = phoneValidator(value, true);
        setErrors((prev) => ({
          ...prev,
          [type]: { ...prev[type], phone: errorMessage },
        }));
      }
    }
  };

  const handleClearForm = () => {
    setFormData((prev) => ({
      ...prev,
      [formType]: Object.keys(prev[formType]).reduce((acc, key) => {
        acc[key] = key === "resume" ? null : "";
        return acc;
      }, {}),
    }));
    setHasConsented(false);
  };

  // Função disparada ao clicar no botão final do Modal de Termos
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    onTermsClose();

    try {
      let result;
      if (formType === "empresa") {
        result = await addCompanyPreRegistration(formData);
      } else {
        result = await addStudentPreRegistration(formData);
      }
      
      if (result && result.status === 201) {
        onOpen(); // Abre modal de sucesso
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

      <Flex justifyContent="center" mb={8} wrap="wrap">
        <Button
          variant={formType === "aluno" ? "solid" : "outline"}
          color={formType === "aluno" ? "white" : "#5931E9"}
          bg={formType === "aluno" ? "#5931E9" : "transparent"}
          fontWeight="bold"
          px={6}
          mr={4}
          onClick={() => setFormType("aluno")}
        >
          Candidato
        </Button>
        <Button
          variant={formType === "empresa" ? "solid" : "outline"}
          color={formType === "empresa" ? "white" : "#5931E9"}
          bg={formType === "empresa" ? "#5931E9" : "transparent"}
          fontWeight="bold"
          px={6}
          onClick={() => setFormType("empresa")}
        >
          Empresa
        </Button>
      </Flex>

      <form onSubmit={(e) => { e.preventDefault(); onTermsOpen(); }}>
        <VStack spacing={6} align="stretch">
          {formType === "empresa" ? (
            <>
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
                  <FormLabel>NIPC</FormLabel>
                  <Input
                    name="nif"
                    maxLength={9}
                    value={currentFormData.nif}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Digite o NIPC"
                    bg="gray.50"
                  />
                  {currentErrors.nif && <FormErrorMessage>{currentErrors.nif}</FormErrorMessage>}
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
                      <Input {...inputProps} name="phone" placeholder="Digite o telemóvel" bg="gray.50" />
                    )}
                  </ReactInputMask>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Setor de atuação</FormLabel>
                  <Select
                    name="sector"
                    value={currentFormData.sector}
                    onChange={(e) => handleInputChange(e, "empresa")}
                    placeholder="Selecione o setor"
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
                <FormLabel>Ramo de atividade</FormLabel>
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
                  <FormLabel>Telemóvel</FormLabel>
                  <ReactInputMask
                    mask="+351 999 999 999"
                    value={formData.aluno.phone}
                    onChange={(e) => handleInputChange(e, "aluno")}
                  >
                    {(inputProps) => (
                      <Input {...inputProps} name="phone" placeholder="Digite o telemóvel" bg="gray.50" />
                    )}
                  </ReactInputMask>
                </FormControl>
              </Stack>
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Nível de Ensino</FormLabel>
                  <Select
                    name="education_level"
                    value={currentFormData.education_level}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Selecione uma opção"
                    bg="gray.50"
                  >
                    <option value="E">Nível 4 / Secundário</option>
                    <option value="CP5">CET - Nível 5</option>
                    <option value="TS">TESP - Nível 5</option>
                  </Select>
                </FormControl>
                <FormControl isRequired isInvalid={!!currentErrors.nif}>
                  <FormLabel>NIF</FormLabel>
                  <Input
                    name="nif"
                    maxLength={9}
                    value={currentFormData.nif}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Digite o NIF"
                    bg="gray.50"
                  />
                  {currentErrors.nif && <FormErrorMessage>{currentErrors.nif}</FormErrorMessage>}
                </FormControl>
              </Stack>

              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Distrito da Escola</FormLabel>
                  <ReactSelect
                    options={districts}
                    onChange={(option) => setSchoolLocation(prev => ({ ...prev, district: option?.value, city: null }))}
                    placeholder="Selecione..."
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Concelho da Escola</FormLabel>
                  <ReactSelect
                    isDisabled={!schoolLocation.district}
                    options={citiesOptions}
                    onChange={(option) => setSchoolLocation(prev => ({ ...prev, city: option?.value }))}
                    placeholder="Selecione..."
                  />
                </FormControl>
              </Stack>

              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                <FormControl isRequired>
                  <FormLabel>Escola</FormLabel>
                  <ReactSelect
                    options={schoolOptions}
                    value={schoolOptions.find(o => o.value === currentFormData.school_id) || null}
                    onChange={(option) => setFormData(prev => ({
                      ...prev,
                      aluno: { ...prev.aluno, school_id: option?.value || "", course: "" }
                    }))}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Curso</FormLabel>
                  <Select
                    name="course"
                    value={currentFormData.course}
                    onChange={(e) => handleInputChange(e, "aluno")}
                    placeholder="Selecione..."
                    isDisabled={!currentFormData.school_id || records.length === 0}
                    bg="gray.50"
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>{record.title}</option>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <FormControl>
                <FormLabel>Voluntariado</FormLabel>
                <Textarea
                  name="volunteer_experience"
                  value={currentFormData.volunteer_experience}
                  onChange={(e) => handleInputChange(e, "aluno")}
                  placeholder="Descreva..."
                  bg="gray.50"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Currículo (CV)</FormLabel>
                <Input name="resume" type="file" onChange={(e) => handleInputChange(e, "aluno")} bg="gray.50" />
              </FormControl>
            </>
          )}

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />

          <Flex justify="space-between" mt={6} wrap="wrap">
            <Button variant="outline" colorScheme="gray" onClick={handleClearForm}>
              Limpar Formulário
            </Button>
            <Button
              fontWeight="bold"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
              type="submit"
              isDisabled={!recaptchaToken}
              isLoading={isSubmitting}
            >
              Efetuar Registo
            </Button>
          </Flex>
        </VStack>
      </form>

      {/* MODAL DE TERMOS E CONDIÇÕES (NOVO) */}
     <Modal isOpen={isTermsOpen} onClose={onTermsClose} size="xl" scrollBehavior="inside">
  <ModalOverlay />
  <ModalContent borderRadius="md">
    <ModalHeader textAlign="center" borderBottomWidth="1px">
      Termos e Condições de Utilização
    </ModalHeader>
    
    <ModalBody p={6}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={4}>
          <img src={logo} alt="Logo NIPEE" style={{ width: "150px", margin: "0 auto" }} />
          <Heading as="h3" size="sm" mt={4}>
            TERMOS E CONDIÇÕES DE UTILIZAÇÃO
          </Heading>
          <Text fontWeight="bold" fontSize="xs">Plataforma NIPEE</Text>
          <Text fontSize="xs">Última atualização: 23/02/2026</Text>
        </Box>

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
                       target="_blank"
                       rel="noopener noreferrer"
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
    </ModalBody>

    <ModalFooter borderTopWidth="1px" flexDirection="column" alignItems="stretch">
      <Checkbox 
        isChecked={hasConsented} 
        onChange={(e) => setHasConsented(e.target.checked)}
        colorScheme="purple"
        mb={4}
      >
        <Text fontSize="sm">Li e aceito os Termos e Condições e a Política de Privacidade.</Text>
      </Checkbox>
      <HStack spacing={4}>
        <Button variant="ghost" flex={1} onClick={onTermsClose}>
          Cancelar
        </Button>
        <Button 
          flex={1}
          bgGradient="linear(to-r, #5931E9, #7289FF)" 
          color="white"
          isDisabled={!hasConsented}
          onClick={handleFinalSubmit}
          _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
        >
          Confirmar Registo
        </Button>
      </HStack>
    </ModalFooter>
  </ModalContent>
</Modal>

      {/* MODAL DE SUCESSO (JÁ EXISTENTE) */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bgGradient="linear(to-r, #5931E9, #7289FF)"
          color="white"
          borderRadius="lg"
          mx={4}
        >
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" mt={4}>
            🎉 Registo Realizado!
          </ModalHeader>
          <ModalBody textAlign="center" py={6} px={8}>
            <Box bg="whiteAlpha.200" p={4} borderRadius="md">
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Seu registo foi efetuado com sucesso!
              </Text>
              <Text fontSize="sm">
                Entraremos em contacto em breve. Fique atento no seu e-mail!
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center" pb={4}>
            <Button onClick={onClose} bg="white" color="#5931E9" borderRadius="full">
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FormularioRegistro;