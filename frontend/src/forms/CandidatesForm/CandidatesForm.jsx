import React, { useState, useEffect } from "react";
import { Formik, Field, FastField, Form } from "formik";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { MdStar, MdOutlineBlock } from "react-icons/md";
import FormField from "../../components/FormField/FormField";
import GroupContainer from "../GroupContainer";
import { ContactFields } from "../Shared/ContactFields";
import AddressFields from "../Shared/AddressFields";
import { cnpjMask } from "../../utils/formHelpers";
import Resource from "../../components/Resource/Resource";
import TimelineRow from "../../components/TimelineRow/TimelineRow";
import DocumentsTable from "../../components/DocumentsTable/DocumentsTable";
import FileUpload from "../../components/FileUpload/FileUpload";
import { nifValidator } from "../../utils/formValidators";
import { Select } from "chakra-react-select";
import axios from "axios";
import api from "../../api";

export const CandidatesForm = ({ readOnly, isLoading, typeForm, ...props }) => {
  const toast = useToast();
  const userProfile = JSON.parse(localStorage.getItem("profile"));
  const userRole = userProfile?.role || "";
  const isEmpresa = userRole === "Empresa";
  const isCandidato = userRole === "Candidato";
  const isEscola = userRole === "Escola";
  const isAdm = userRole === "Administrador Geral";
  const candidateUploadOptions = [
    { value: "Voluntariado", label: "Voluntariado" },
    { value: "Currículo (CV)", label: "Currículo (CV)" },
    { value: "Carta de Apresentação", label: "Carta de Apresentação" },
  ];
  const [documentUpload, setDocumentUpload] = useState({
    type: null,
    document: null,
  });

  const getHistoricIconAndLabelByStatus = (status, date) => {
    switch (Number(status)) {
      case 1:
      default:
        return {
          icon: MdStar,
          title: "Passou para a etapa Chamado",
        };
      case 2:
        return {
          icon: MdStar,
          title: "Passou para a etapa Encaminhado",
        };
      case 3:
        return {
          icon: MdStar,
          title: "Passou para a etapa Em testes",
        };
      case 4:
        return {
          icon: MdStar,
          title: "Passou para a etapa Estagiário",
        };
      case -1:
        return {
          icon: MdOutlineBlock,
          title: "Reprovado",
          color: "red",
        };
    }
  };
  const [showHoursField, setShowHoursField] = useState(false);

  async function handleDocumentUpload(formValues, setFormValues) {
    if (
      formValues.documents.some(
        (element) => element.original_filename === documentUpload.type.value
      )
    ) {
      toast({
        title: "Operação não permitida",
        description: `Já existe um ${documentUpload.type.value} registado. Elimine o documento atual antes de efetuar o novo carregamento`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "left-accent",
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", documentUpload.document);
      formData.append("type", documentUpload.type.value);

      const { data } = await api.post(
        `/candidates/${userProfile.candidate_id}/document`,
        formData
      );
      setFormValues("documents", [...formValues.documents, data]);
      setDocumentUpload({ document: null, type: null });
      document.getElementById("uploadFile").value = "";
    } catch (error) {
      toast({
        title: "Erro!",
        description:
          error.response?.data?.message ||
          error.message ||
          "Ocorreu um erro desconhecido.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "left-accent",
      });
    }
  }

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      {isEmpresa && (
        <Flex justifyContent="flex-end" mb={4}>
          <Button colorScheme="blue" onClick={handleGoBack}>
            Voltar
          </Button>
        </Flex>
      )}
      <Formik
        enableReinitialize
        initialErrors={props.initialErrors}
        initialValues={props.initialValues}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await props.onSubmit(values);
          } catch (error) {
            if (error.response?.data?.errors) {
              Object.keys(error.response.data.errors).forEach((field) => {
                setFieldError(field, error.response.data.errors[field][0]);
              });
            }
            toast({
              title: "Erro!",
              description:
                error.response?.data?.message ||
                error.message ||
                "Ocorreu um erro desconhecido.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
              variant: "left-accent",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <GroupContainer
              title="Dados do candidato"
              subtitle="Dados pessoais do candidato as oportunidades."
            >
              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="name"
                  name="name"
                  placeholder="Nome do candidato"
                  component={FormField}
                  readOnly={readOnly}
                  required
                />

                <FastField
                  id="birth_day"
                  name="birth_day"
                  placeholder="Data de nascimento"
                  component={FormField.InputMask}
                  mask="99/99/9999"
                  readOnly={readOnly}
                  required
                />
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="cpf"
                  name="cpf"
                  placeholder="NIF"
                  component={FormField.InputMask}
                  mask={cnpjMask}
                  readOnly={readOnly}
                  validate={(value) => nifValidator(value, true)}
                  required
                />

                <FastField
                  id="rg"
                  name="rg"
                  placeholder="CC / T. Residência / Passaporte"
                  component={FormField}
                  readOnly={readOnly}
                  required
                />

                <FastField
                  id="rgValidade"
                  name="rgValidade"
                  type="date"
                  placeholder="Validade"
                  component={FormField}
                  readOnly={readOnly}
                  required
                />
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="gender"
                  name="gender"
                  placeholder="Género"
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                </FastField>

                <FastField
                  id="studying_level"
                  name="studying_level"
                  placeholder="Nível de Ensino"
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <option value="E">
                    Cursos Profissionais nível 4 / Ensino Secundário
                  </option>
                  <option value="CP5">Cursos Profissionais CET nível 5</option>
                  <option value="TS">Ensino Superior TESP - Nível 5</option>
                </FastField>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                {/* <FastField
                  id='serie'
                  name='serie'
                  placeholder='Ano'
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <optgroup label='Ensino Secundário'>
                    <option value={11}>1° Ano</option>
                    <option value={12}>2° Ano</option>
                    <option value={13}>3° Ano</option>
                  </optgroup>

                  <optgroup label='Outros'>
                    <option value={14}>1° Ano Supletivo</option>
                    <option value={15}>2° Ano Supletivo</option>
                    <option value={16}>3° Ano Supletivo</option>
                  </optgroup>

                  <option value={17}>Incompleto</option>
                  <option value={18}>Completo</option>
                  <option value={19}>9ª ano fundamental (eja)</option>
                </FastField> */}
                <>
                  <Resource
                    resource="BaseRecords"
                    autoFetch
                    resourceParams={{ type: 6, perPage: 9999 }}
                  >
                    {({ records, isLoading }) => (
                      <Field
                        id="course"
                        name="course"
                        placeholder="Curso"
                        component={FormField.Select}
                        readOnly={readOnly}
                        isLoading={isLoading}
                        required
                      >
                        {(records || []).map((record) => (
                          <option key={record.id} value={record.id}>
                            {record.title}
                          </option>
                        ))}
                      </Field>
                    )}
                  </Resource>

                  <FastField
                    id="semester"
                    name="semester"
                    placeholder="Ano"
                    component={FormField.Select}
                    readOnly={readOnly}
                  >
                    {[...Array(3).keys()].map((v) => (
                      <option key={v} value={v}>
                        {++v}° Ano
                      </option>
                    ))}
                  </FastField>
                </>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="ra"
                  name="ra"
                  placeholder="N.º Processo"
                  component={FormField}
                  readOnly={readOnly}
                />
                <FastField
                  id="period"
                  name="period"
                  placeholder="Período"
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <option value="N">Noite</option>
                  <option value="I">Integral</option>
                </FastField>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <Resource
                  resource="Schools"
                  autoFetch
                  resourceParams={{ perPage: 9999 }}
                >
                  {({ records, isLoading }) => (
                    <Field
                      id="school_id"
                      name="school_id"
                      placeholder="Escola"
                      component={FormField.Select}
                      readOnly={readOnly}
                      isLoading={isLoading}
                      required
                    >
                      <option value="">Selecione</option>
                      {(records || []).map((record) => (
                        <option key={record.id} value={record.id}>
                          {record.corporate_name}
                        </option>
                      ))}
                    </Field>
                  )}
                </Resource>

                <FastField
                  id="interest"
                  name="interest"
                  placeholder="Interesse"
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue("interest", value);
                    setShowHoursField(value === "EF");
                  }}
                >
                  <option value="EF">FCT</option>
                  <option value="ES">Estágio</option>
                  {/* <option value="EF">Efetivo</option>
                <option value="AM">Ambos</option> */}
                </FastField>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                {values.interest === "EF" && (
                  <FastField
                    id="hours_fct"
                    name="hours_fct"
                    placeholder="N.º Horas FCT"
                    component={FormField}
                    readOnly={readOnly}
                  />
                )}
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="volunteer_experience"
                  name="volunteer_experience"
                  placeholder="Participa ou participou de voluntariado? Descreva"
                  component={FormField.Textarea}
                  readOnly={readOnly}
                />
              </Stack>

              {/* <Stack direction={['column', 'row']} spacing="24px" align="center">
              {props.initialValues?.resume && (
                <a
                  target="_blank"
                  href={`${import.meta.env.VITE_BACKEND_BASE_URL_EX}/storage/${props.initialValues.resume}`}
                  style={{
                    color: '#3182ce',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-block',
                    paddingBottom: '4px',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.color = '#63b3ed')}
                  onMouseOut={(e) => (e.target.style.color = '#3182ce')}
                >
                  Ver o Currículo
                </a>
              )}

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => {
                  const file = event.target.files[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const base64String = reader.result.split(',')[1]; 
                      setFieldValue('resume', base64String);
                    };
                  }
                }}
                style={{ display: 'none' }}
                disabled={readOnly}
              />

              {!readOnly && (
                <label htmlFor="resume">
                  <Button
                    as="span"
                    colorScheme="blue"
                    size="sm"
                    fontWeight="500"
                    borderRadius="md"
                    _hover={{
                      bg: '#63b3ed',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {props.initialValues?.resume ? 'Trocar Currículo' : 'Anexar Currículo'}
                  </Button>
                </label>
              )}
            </Stack> */}
            </GroupContainer>

            <Divider my={25} />

            <GroupContainer
              title="Dados da morada"
              subtitle="Lugar em que o candidato mora."
            >
              <AddressFields
                readOnly={readOnly}
                setFieldValue={setFieldValue}
              />
            </GroupContainer>

            <Divider my={25} />

            <GroupContainer
              title="Dados do contacto"
              subtitle="Preencha os dados que serão usados para entrar em contacto com o candidato."
            >
              <ContactFields
                requiredFields={["name", "phone"]}
                readonly={readOnly}
              />
            </GroupContainer>

            <Divider my={25} />

            <GroupContainer
              title="Outras informações"
              subtitle="Dados complementares sobre o candidato"
            >
              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="piercing"
                  name="piercing"
                  placeholder="Portador de Deficiência?"
                  component={FormField.Select}
                  readOnly={readOnly}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </FastField>

                <FastField
                  id="tattoo"
                  name="tattoo"
                  placeholder="Se sim, qual?"
                  component={FormField}
                  readOnly={readOnly}
                ></FastField>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="smoker"
                  name="smoker"
                  placeholder="Fumador"
                  component={FormField.Select}
                  readOnly={readOnly}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </FastField>

                <FastField
                  id="sons"
                  name="sons"
                  placeholder="Filhos"
                  component={FormField.Select}
                  readOnly={readOnly}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </FastField>
              </Stack>
              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="marital_status"
                  name="marital_status"
                  placeholder="Estado Cívil"
                  component={FormField.Select}
                  readOnly={readOnly}
                >
                  <option value="S">Solteiro</option>
                  <option value="C">Casado</option>
                  <option value="V">Viúvo</option>
                  <option value="D">Divorciado</option>
                </FastField>

                <FastField
                  id="how_find_us"
                  name="how_find_us"
                  placeholder="Como nos conheceu"
                  component={FormField.Select}
                  readOnly={readOnly}
                >
                  <option value="6">EMPRESA</option>
                  <option value="7">ESCOLA</option>
                  <option value="11">EVENTO</option>
                  <option value="5">FACEBOOK</option>
                  <option value="10">FEIRA</option>
                  <option value="3">GOOGLE</option>
                  <option value="2">INDICAÇÃO DE AMIGO</option>
                  <option value="4">INTERNET</option>
                  <option value="13">OUTRO</option>
                  <option value="9">PANFLETO</option>
                  <option value="8">PLACA DE DIVULGAÇÃO</option>
                  <option value="12">ANUNCIO</option>
                </FastField>
              </Stack>

              <Stack direction={["column", "row"]} spacing="24px">
                {/*  <FastField
                id='how_find_us_name'
                name='how_find_us_name'
                placeholder='Qual/Onde?'
                component={FormField}
                readOnly={readOnly}
              /> */}
                {/*  <FastField
                id='tags'
                name='tags'
                placeholder='Palavras chaves'
                component={FormField}
                readOnly={readOnly}
              /> */}
              </Stack>
              <Stack direction={["column", "row"]} spacing="24px">
                <FastField
                  id="candidate_observations"
                  name="candidate_observations"
                  placeholder="Habilidades (ex. PHP, Inglês, Java)"
                  component={FormField.Textarea}
                  readOnly={readOnly}
                />
              </Stack>
            </GroupContainer>

            {values.jobs && (
              <GroupContainer
                title="Candidaturas"
                subtitle="Histórico de participações em oportunidades."
              >
                <Accordion allowToggle>
                  {!values.jobs.length && <Text>Sem histórico</Text>}
                  {values.jobs.map((job) => (
                    <AccordionItem key={job.id}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {job.company?.corporate_name ||
                              "Empresa não informada"}{" "}
                            - {job.role || "Vaga não informada"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Flex direction="column">
                          {(job.history || []).map((row, index, arr) => {
                            const data = getHistoricIconAndLabelByStatus(
                              row.status,
                              row.created_at
                            );

                            return (
                              <TimelineRow
                                key={row.title}
                                logo={data.icon}
                                title={data.title}
                                date={moment(row.created_at).format(
                                  "DD/MM/YYYY HH:mm:ss"
                                )}
                                color={data.color || "green"}
                                index={index}
                                arrLength={arr.length}
                              />
                            );
                          })}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GroupContainer>
            )}

            {/* {['edit', 'view'].includes(typeForm) && (
            <GroupContainer
              title='Anexos'
            subtitle='Todos anexos disponíveis enviados pelo candidato '
            >
              <DocumentsTable
                typeForm={typeForm}
                documents={values.documents}
                {...(typeForm === 'edit' && {
                  thContent: (
                    <FileUpload
                      resource={props.resource}
                      types={[
                        'CurriculumVitae',
                        'CoverLetter',
                        'Volunteering',
                        'Others',
                      ]}
                      model='Candidate'
                    />
                  )
                })}
              />
            </GroupContainer>
          )} */}

            {["edit", "view", undefined].includes(typeForm) && (
              <GroupContainer
                title="Documentos"
                subtitle="Todos anexos disponíveis para este protocolo"
              >
                {isCandidato && (
                  <Stack
                    spacing={4}
                    direction={{ base: "column", md: "row" }}
                    align={"center"}
                  >
                    <FormControl>
                      <FormLabel>Tipo do documento</FormLabel>
                      <Select
                        name="type"
                        options={candidateUploadOptions}
                        value={documentUpload.type}
                        onChange={(option) => {
                          if (option && option.value) {
                            setDocumentUpload((prev) => ({
                              ...prev,
                              type: option,
                            }));
                          }
                        }}
                        placeholder="Selecione um tipo"
                        chakraStyles={{
                          control: (provided) => ({
                            ...provided,
                            background: "gray.50",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            background: "gray.50",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Documento</FormLabel>
                      <Input
                        name="file"
                        id="uploadFile"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setDocumentUpload((prev) => ({
                              ...prev,
                              document: e.target.files[0],
                            }));
                          }
                        }}
                        bg="gray.50"
                      />
                    </FormControl>
                    <Button
                      width={"10em"}
                      disabled={
                        documentUpload.type === "" ||
                        documentUpload.document === null
                      }
                      onClick={() => {
                        console.log(values);
                        handleDocumentUpload(values, setFieldValue);
                      }}
                      style={{ marginTop: "auto" }}
                    >
                      Adicionar
                    </Button>
                  </Stack>
                )}
                <DocumentsTable
                  typeForm={typeForm}
                  documents={values.documents}
                  {...(typeForm === "edit" && {
                    thContent: (
                      <FileUpload
                        resource={props.resource}
                        types={
                          isCandidato
                            ? [
                                "CurriculumVitae",
                                "CoverLetter",
                                "Volunteering",
                                "Others",
                              ]
                            : [
                                "Contracts",
                                "School_Statement",
                                "Evaluation_Closes",
                              ]
                        }
                        model="Candidate"
                      />
                    ),
                  })}
                />
              </GroupContainer>
            )}
            {props.children}
          </Form>
        )}
      </Formik>
    </>
  );
};
