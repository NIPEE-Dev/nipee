import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  Divider,
  Spinner,
  Stack,
  Text,
  useToast,
  Tooltip,
  Checkbox,
  useControllableState,
} from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';
import { FastField, Field, Form, Formik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import {
  beforeMaskedValueChangePhone,
  cnpjMask,
  makeJourneyText,
  weekDays
} from '../../utils/formHelpers';
import AddressFields from '../Shared/AddressFields';
import {
  fetchContractData,
  isLoading,
  records
} from '../../store/ducks/contracts';
import Resource from '../../components/Resource/Resource';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';
import { WithModal } from '../../components/WithModal';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';
import {
  birthDayValidator,
  cpfValidator,
  nifValidator,
  phoneValidator
} from '../../utils/formValidators';
import { Select as ReactSelect } from "chakra-react-select";


export const ContractsForm = ({
  readOnly,
  isLoading,
  isLoadingResource,
  records,
  fetchContractData,
  typeForm,
  ...props
}) => {
  const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [jobsArr, setJobsArr] = useState(undefined);


  useEffect(() => {
    if (state) {
      fetchContractData({ job: state.job, candidate: state.candidate });
      navigate(location.pathname, {});
    }
  }, []);

  if (isLoadingResource) {
    return <Spinner />;
  }

  const handleCandidateChange = (
    setFieldValue,
    candidates,
    selectedCandidate
  ) => {
    const candidate = candidates.find((c) => c.id === +selectedCandidate);
    console.log('candidado:', candidate, candidates, selectedCandidate);
    if (candidate) {

      setFieldValue('candidate', {
        id: candidate.id,
        ...candidate
      }, false);
      setFieldValue('userAddress', candidate.address, false);

      setTimeout(() => {
        if (candidate.contact?.phone) {
          setFieldValue('candidate.contact.phone', candidate.contact.phone, true);
        }
        if (candidate.cpf) {
          setFieldValue('candidate.cpf', candidate.cpf, true);
        }
      }, 100);
    }
  };

  const handleJobChange = (setFieldValue, jobs, selectedJob) => {
    const job = jobs.find((j) => j.id === +selectedJob);

    if (job) {
      setFieldValue('job', job, true);
      setFieldValue('working_day', job.working_day, true);
      setFieldValue('jobAddress', job.company.address, true);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
      initialValues={{
        ...(_isEmpty(props.initialValues) ? {} : props.initialValues),
        company_id: props.initialValues?.company_id || '0',
        has_insurance: props.initialValues?.has_insurance || false,
        retroative_billing: props.initialValues?.retroative_billing || '0',
        working_day: {
          ...props.initialValues?.working_day,
          day_off: props.initialValues?.working_day?.day_off || 'DUAS FOLGAS SEMANAIS AO SÁBADO E DOMINGO',
          start_weekday: props.initialValues?.working_day?.start_weekday || 1,
          end_weekday: props.initialValues?.working_day?.start_weekday || 5,
        },
        manual_contract_upload: false,
        manual_contract_file: null,
      }}
       onSubmit={async (values, { setSubmitting, setFieldError }) => {
    try {
      await props.onSubmit(values);
      toast({
        title: "Sucesso",
        description: "Protocolo salvo com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach(field => {
          setFieldError(field, error.response.data.errors[field][0]);
        });
      }
      
      toast({
        title: "Erro!",
        description: error.response?.data?.message || error.message || "Ocorreu um erro desconhecido.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'left-accent',
      });
    } finally {
      setSubmitting(false);
    }
  }}
    >
      {(formProps) => (
        <Form>
          {formProps.initialValues && formProps.initialValues.status === 0 && (
            <Alert status='warning' variant='left-accent'>
              <AlertIcon />
              Este protocolo foi rescindido em{' '}
              {formProps.initialValues.terminated_at} e não pode ser mais
              alterado.
              <br />
              Motivo: {formProps.initialValues.end_contract_reason}
            </Alert>
          )}
          <GroupContainer
            title='Dados básicos'
            subtitle='Informações pertinentes a escolha da empresa e da escola'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <Resource
                resource='Companies'
                autoFetch
                resourceParams={{
                  perPage: 9999,
                  ...(typeForm === 'add' && { withoutTrashed: true })
                }}
              >
                {({ records, isLoading }) => (
                  <Field
                    id='company_id'
                    name='company_id'
                    placeholder='Empresa'
                    component={FormField.Select}
                    readOnly={readOnly}
                    isLoading={isLoading}
                    required
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.corporate_name} --------- {record.fantasy_name}{' '}
                      </option>
                    ))}
                  </Field>
                )}
              </Resource>

              <Resource
                resource='Schools'
                autoFetch
                resourceParams={{
                  perPage: 9999,
                  /* schoolId: formProps.values.candidate && formProps.values.candidate.user && formProps.values.candidate.user.school && formProps.values.candidate.user.school[0] ? formProps.values.candidate.user.school[0].id : null, */
                  ...(typeForm === 'add' && { withoutTrashed: true })
                }}
              >
                {({ records, isLoading }) => (
                  <Field
                    id={
                      typeForm === 'edit' ? 'school_id' : 'school.id'
                    }
                    name={
                      typeForm === 'edit' ? 'school_id' : 'school.id'
                    }
                    as="select"
                    placeholder='Escola'
                    component={FormField.Select}
                    readOnly={readOnly}
                    isLoading={isLoading}
                    required
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                      {record.corporate_name}              
                      </option>
                    ))}
                  </Field>
                )}
              </Resource>
            </Stack>
            <Resource
              resource='Jobs'
              resourceParams={{
                company_id: formProps.values.company_id,
                perPage: 9999,
                ...(typeForm === 'add' && { withoutTrashed: true })
              }}
              autoFetch={formProps.values.company_id}
            >
              {({ records, isLoading }) => {
                if (jobsArr === undefined) {
                  setJobsArr(records);
                }
                
                return (
                <Field
                  id='job.id'
                  name='job.id'
                  placeholder='Vaga'
                  component={FormField.Select}
                  readOnly={readOnly}
                  isLoading={isLoading}
                  disabled={!formProps.values.company_id}
                  onChangeCallback={(e) =>
                    handleJobChange(
                      formProps.setFieldValue,
                      records,
                      e.target.value
                    )
                  }
                  required
                >
                  {records.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.role}
                    </option>
                  ))}
                  {records.length === 0 && (
                    <option disabled>
                      Nenhuma vaga disponível para esta empresa
                    </option>
                  )}
                </Field>
              )}}
            </Resource>
          </GroupContainer>

          <GroupContainer
            title='Dados do candidato'
            subtitle='Dados pessoais do candidato para a vaga'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              {['edit', 'view'].includes(typeForm) ? (
                <FastField
                  id='candidate.name'
                  name='candidate.name'
                  placeholder='Nome do candidato'
                  component={FormField}
                  readOnly={readOnly}
                />
              ) : (
                <Resource
                  resource='Candidates'
                  autoFetch={formProps.values.school && formProps.values.school.id}
                  resourceParams={{
                    perPage: 9999,
                    ...(typeForm === 'add' && { withoutTrashed: true })
                  }}
                >
                  {({ records, isLoading }) => {
                    const selectedSchoolId = typeForm === 'edit'
                      ? formProps.values.school_id
                      : formProps.values?.school?.id;
                      let jobs;
                      if (formProps.values.job && formProps.values.job.candidates && formProps.values.job.candidates.length > 0) {
                        jobs = formProps.values.job.candidates;
                      } else {
                        const selected = jobsArr ? jobsArr.find((element) => element.id === formProps.values.job_id) : undefined
                        jobs = selected ? selected.candidates : [];
                      }
                      const approvedCandidatesIds = jobs.filter((element) => element.statusLabel === 'Aprovado').map((element) => element.id)

                      const candidatesFromSchool = (records || []).filter(
                        (record) =>
                          record.user?.school?.some(
                            (school) => String(school.id) === String(selectedSchoolId)
                          ) && approvedCandidatesIds.includes(record.id)
                      );    ;                   

                    return (
                      <Field
                        id="candidate.id"
                        name="candidate.id"
                        placeholder="Nome do candidato"
                        component={FormField.Select}
                        isLoading={isLoading}
                        readOnly={readOnly}
                        onChangeCallback={(e) =>{
                          handleCandidateChange(
                            formProps.setFieldValue,
                            records,
                            e.target.value
                          ); console.log(formProps.values)}
                        }
                        required
                      >
                        {candidatesFromSchool.map((record) => (
                          <option key={record.id} value={record.id}>
                            {record.name}
                          </option>
                        ))}
                        {candidatesFromSchool.length === 0 && (
                          <option disabled>
                            Nenhum candidato disponível para esta escola
                          </option>
                        )}
                      </Field>
                    );
                  }}
                </Resource>
              )}

              <FastField
                id='candidate.birth_day'
                name='candidate.birth_day'
                placeholder='Data de nascimento'
                component={FormField.InputMask}
                mask='99/99/9999'
                validate={(value) => birthDayValidator(value, false)}
                readOnly={readOnly}
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='candidate.cpf'
                name='candidate.cpf'
                placeholder='NIF'
                component={FormField.InputMask}
                mask={cnpjMask}
                readOnly={readOnly}
                validate={(value) => nifValidator(value, false)}
                required
              />

              <FastField
                id='candidate.rg'
                name='candidate.rg'
                placeholder='CC / T. Residência / Passaporte'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='candidate.studying_level'
                name='candidate.studying_level'
                placeholder='Nível de Ensino'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='E'>Cursos Profissionais nível 4 / Ensino Secundário</option>
                <option value='CP5'>Cursos Profissionais CET nível 5</option>
                <option value='TS'>Ensino Superior TESP - Nível 5</option>
              </FastField>

              {formProps.values?.candidate?.studying_level === 'TS' && (
                <FastField
                  id='candidate.mandatory_internship'
                  name='candidate.mandatory_internship'
                  placeholder='Estágio obrigatório?'
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <option value='1'>Sim</option>
                  <option value='0'>Não</option>
                </FastField>
              )}
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              {formProps.values?.candidate?.studying_level === '-' ? (
                <FastField
                  id='candidate.serie'
                  name='candidate.serie'
                  placeholder='Série'
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <optgroup label='Ensino Secundário'>
                    <option value={11}>1° Ano</option>
                    <option value={12}>2° Ano</option>
                    <option value={13}>3° Ano</option>
                  </optgroup>

                  {/* <optgroup label='Outros'>
                    <option value={14}>1° Ano Supletivo</option>
                    <option value={15}>2° Ano Supletivo</option>
                    <option value={16}>3° Ano Supletivo</option>
                  </optgroup> */}
                </FastField>
              ) : (
                <>
                  <Resource
                    resource='BaseRecords'
                    autoFetch
                    resourceParams={{ type: 6, perPage: 9999 }}
                   >
                    {({ records, isLoading }) => (
                      <Field
                        id='candidate.course'
                        name='candidate.course'
                        placeholder='Curso'
                        component={FormField.Select}
                        readOnly={readOnly}
                        isLoading={isLoading}
                        required
                      >
                      {records.map((record) => (
                        <option key={record.id} value={record.id}>
                          {record.title}
                        </option>
                      ))}
                      </Field>
                     )}
                  </Resource>
                  <FastField
                    id='candidate.semester'
                    name='candidate.semester'
                    placeholder='Ano'
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
              )}
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='candidate.ra'
                name='candidate.ra'
                placeholder='N.º Processo'
                component={FormField}
                readOnly={readOnly}
              />

              <FastField
                id='candidate.period'
                name='candidate.period'
                placeholder='Período'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='M'>Manhã</option>
                <option value='T'>Tarde</option>
                <option value='N'>Noite</option>
                <option value='I'>Integral</option>
              </FastField>
            </Stack>

            <Divider my={6} />

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='candidate.contact.phone'
                name='candidate.contact.phone'
                placeholder='Telemóvel'
                component={FormField.InputMask}
                mask="+351 999 999 999"
                maskChar={undefined}
                beforeMaskedValueChange={beforeMaskedValueChangePhone}
                readOnly={readOnly}
                validate={(value) => phoneValidator(value, true)}
                required
              />

            </Stack>
          </GroupContainer>

          <GroupContainer
            title='Morada do candidato'
            subtitle='Dados pertinente a morada do candidato'
          >
            <AddressFields
              readOnly={readOnly}
              setFieldValue={formProps.setFieldValue}
              relation='userAddress'
            />
          </GroupContainer>

          <Divider mt={10} />

          <GroupContainer
            title='Dados da vaga'
            subtitle='Informações pertinentes a vaga'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='job.scholarship_value'
                name='job.scholarship_value'
                placeholder='Bolsa (€)'
                component={FormField.InputMoney}
                readOnly={readOnly}
                required
              />

              <FastField
                id='job.scholarship_nominal_value'
                name='job.scholarship_nominal_value'
                placeholder='Vale nominal da bolsa'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='job.transport_voucher'
                name='job.transport_voucher'
                placeholder='Vale transporte'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>

              <FastField
                id='job.type'
                name='job.type'
                placeholder='Tipo de vaga'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='ES'>Estágio</option>
                <option value='EF'>FCT</option>
              </FastField>
            </Stack>

            {formProps.values &&
              (formProps.values.transport_voucher == 1 ||
                (formProps.values.job &&
                  formProps.values.job.transport_voucher == 1)) && (
                <Stack direction={['column', 'row']} spacing='24px'>
                  <FastField
                    id='job.transport_voucher_value'
                    name='job.transport_voucher_value'
                    placeholder='Valor do vale transporte'
                    component={FormField.InputMoney}
                    readOnly={readOnly}
                  />

                  <FastField
                    id='job.transport_voucher_nominal_value'
                    name='job.transport_voucher_nominal_value'
                    placeholder='Valor nominal do vale transporte'
                    component={FormField}
                    readOnly={readOnly}
                  />
                </Stack>
              )}
          </GroupContainer>

          {/* <GroupContainer
            title='Outro local de trabalho?'
            subtitle='O local de trabalho é preenchido automaticamente pelo sistema com base no endereço da empresa. Caso o local de trabalho seja diferente do local de trabalho da empresa, informe ao lado, senão, deixe em branco'
          >
            <AddressFields
              readOnly={readOnly}
              setFieldValue={formProps.setFieldValue}
              relation='jobOtherAddress'
              required={
                formProps.values.jobOtherAddress?.cep ||
                formProps.values.jobOtherAddress?.uf ||
                formProps.values.jobOtherAddress?.city ||
                formProps.values.jobOtherAddress?.address ||
                formProps.values.jobOtherAddress?.district ||
                formProps.values.jobOtherAddress?.complement ||
                false
              }
            />
          </GroupContainer> */}

          <GroupContainer
            title='Dados do horário'
            subtitle='Informações pertinentes a carga horária da vaga'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.start_weekday'
                name='working_day.start_weekday'
                placeholder='De'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                {weekDays.map((day, i) => (
                  <option value={i + 1}>{day}</option>
                ))}
              </FastField>

              <FastField
                id='working_day.end_weekday'
                name='working_day.end_weekday'
                placeholder='Á'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                {weekDays.map((day, i) => (
                  <option value={i + 1}>{day}</option>
                ))}
              </FastField>
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.start_hour'
                name='working_day.start_hour'
                placeholder='Das'
                component={FormField}
                type='time'
                readOnly={readOnly}
                required
              />

              <FastField
                id='working_day.end_hour'
                name='working_day.end_hour'
                placeholder='As'
                component={FormField}
                type='time'
                readOnly={readOnly}
                required
              />
            </Stack>

            <Text
              display='flex'
              flexDirection='row'
              marginX={2}
              as='i'
              _before={{
                content: `""`,
                flex: '1 1',
                borderBottom: '2px solid var(--chakra-colors-gray-200)',
                margin: 'auto'
              }}
              _after={{
                content: `""`,
                flex: '1 1',
                borderBottom: '2px solid var(--chakra-colors-gray-200)',
                margin: 'auto'
              }}
            >
              <chakra.div
                textAlign='center'
                userSelect='none'
                color='gray.500'
                width='140px'
              >
                Excessão
              </chakra.div>
            </Text>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.day_off_start_weekday'
                name='working_day.day_off_start_weekday'
                placeholder='De'
                component={FormField.Select}
                readOnly={readOnly}
              >
                {weekDays.map((day, i) => (
                  <option value={i + 1}>{day}</option>
                ))}
              </FastField>

              <FastField
                id='working_day.day_off_start_hour'
                name='working_day.day_off_start_hour'
                placeholder='Das'
                component={FormField}
                type='time'
                readOnly={readOnly}
              />

              <FastField
                id='working_day.day_off_end_hour'
                name='working_day.day_off_end_hour'
                placeholder='As'
                component={FormField}
                type='time'
                readOnly={readOnly}
              />
            </Stack>

            <Text
              display='flex'
              flexDirection='row'
              marginX={2}
              as='i'
              _before={{
                content: `""`,
                flex: '1 1',
                borderBottom: '2px solid var(--chakra-colors-gray-200)',
                margin: 'auto'
              }}
              _after={{
                content: `""`,
                flex: '1 1',
                borderBottom: '2px solid var(--chakra-colors-gray-200)',
                margin: 'auto'
              }}
            >
            </Text>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.day_off'
                name='working_day.day_off'
                placeholder='Folga'
                component={FormField}
                readOnly={readOnly}
                maxLength={191}
                required
              />

              <FastField
                id='working_day.working_hours'
                name='working_day.working_hours'
                placeholder='Horas semanais'
                component={FormField}
                type='number'
                inputMode="numeric"
                pattern="[0-9]*"
                readOnly={readOnly}
                required
              />
            </Stack>
            {makeJourneyText(formProps.values)}
          </GroupContainer>

          <GroupContainer
            title='Dados do protocolo'
            subtitle='Dados pertinentes ao protocolo'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='supervisor'
                name='supervisor'
                placeholder='Orientador de Estágio'
                component={FormField}
                readOnly={readOnly}
                required
              />
              <FastField
                id='funcao'
                name='funcao'
                placeholder='Função'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='start_contract_vigence'
                name='start_contract_vigence'
                placeholder='Início do Protocolo'
                type='date'
                component={FormField}
                readOnly={readOnly}
                required
              />

              <FastField
                id='end_contract_vigence'
                name='end_contract_vigence'
                placeholder='Fim do Protocolo'
                type='date'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px' display={'none'}>
              <FastField
                id='retroative_billing'
                name='retroative_billing'
                placeholder='Cobrança Retroativa'
                component={FormField.Select}
                readOnly={readOnly}
                required
                style={{ display: 'none' }}
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>
            </Stack>

            <Box mt={4}>
              <Field name="manual_contract_upload">
                {({ field }) => (
                  <Checkbox
                    {...field}
                    id="manual_contract_upload"
                    isChecked={field.value}
                    onChange={(e) => {
                      formProps.setFieldValue('manual_contract_upload', e.target.checked);

                      if (!e.target.checked) {
                        formProps.setFieldValue('manual_contract_file', null);
                      }
                    }}
                    isDisabled={readOnly}
                  >
                    Deseja subir um protocolo manual?
                  </Checkbox>
                )}
              </Field>
            </Box>

            {formProps.values.manual_contract_upload && (
              <Box mt={4}>
                <Text mb={2}>Anexar protocolo manual:</Text>
                <input
                  type="file"
                  id="manual_contract_file"
                  name="manual_contract_file"
                  onChange={(event) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      formProps.setFieldValue(
                        'manual_contract_file',
                        base64String
                      );
                    };
                    reader.readAsDataURL(event.currentTarget.files[0]);
                  }}
                  disabled={readOnly}
                />
                {formProps.errors.manual_contract_file && formProps.touched.manual_contract_file && (
                  <Text color="red.500" fontSize="sm">
                    {formProps.errors.manual_contract_file}
                  </Text>
                )}
              </Box>
            )}
          </GroupContainer>

          <GroupContainer title='Dados do seguro' subtitle='Dados pertinentes ao seguro'>
            <Stack direction={['column', 'row']} spacing='24px' alignItems="center">
              <Field name="has_insurance">
                {({ field, form }) => (
                  <Checkbox
                    {...field}
                    id="has_insurance"
                    isChecked={field.value}
                    onChange={(e) => {
                      form.setFieldValue('has_insurance', e.target.checked);
                      if (!e.target.checked) {
                        form.setFieldValue('insurance_number', '');
                        form.setFieldValue('insurance_date', '');
                      }
                    }}
                    isReadOnly={readOnly}
                  >
                    Possuí seguro?
                  </Checkbox>
                )}
              </Field>
            </Stack>

            {formProps.values.has_insurance && (
              <Stack direction={['column', 'row']} spacing='24px' mt={4}>
                <FastField
                  id='insurance_number'
                  name='insurance_number'
                  placeholder='Número do seguro'
                  component={FormField}
                  readOnly={readOnly}
                  required={formProps.values.has_insurance}
                />
                <FastField
                  id='insurance_date'
                  name='insurance_date'
                  placeholder='Data início do seguro'
                  component={FormField}
                  type='date'
                  readOnly={readOnly}
                  required={formProps.values.has_insurance}
                />
              </Stack>
            )}
          </GroupContainer>

          {['edit', 'view'].includes(typeForm) && (
            <GroupContainer
              title='Documentos'
              subtitle='Todos anexos disponíveis para este protocolo'
            >
              <DocumentsTable
                typeForm={typeForm}
                documents={formProps.values.documents}
                {...(typeForm === 'edit' &&
                  formProps.initialValues &&
                  formProps.initialValues.status !== 0 && {
                  thContent: (
                    <FileUpload
                      resource={props.resource}
                      types={[
                        'Contracts',
                        'Addendum',
                        'School_Statement',
                        'Evaluation_Closes'
                      ]}
                      model='Contract'
                    />
                  )
                })}
              />
            </GroupContainer>
          )}

          {/* {typeForm === 'edit' && (
            <GroupContainer
              title='Adendo'
              subtitle='Coloque as informações para criar um adendo'
            >
              <Stack direction='column' spacing='24px'>
                <FastField
                  id='adendo_number'
                  name='adendo_number'
                  placeholder='Item número'
                  component={FormField}
                  readOnly={readOnly}
                  required
                />

                <FastField
                  id='adendo_description'
                  name='adendo_description'
                  placeholder='Descrição do Adendo'
                  component={FormField.Textarea}
                  readOnly={readOnly}
                  required
                />
              </Stack>
            </GroupContainer>
          )} */}

          {(typeForm === 'add' || typeForm === undefined) && ( //!ver depois
            <Box py={3} textAlign='right'>
              <Button
                mt='3'
                colorScheme='blue'
                type='submit'
                isLoading={isLoading || formProps.isSubmitting}
                disabled={
                  formProps.initialValues &&
                  formProps.initialValues.status === 0
                }
              >
                Salvar
              </Button>
            </Box>
          )}

          {readOnly !== true && typeForm === 'edit' && (
            <Box py={3} textAlign='right'>
              <WithModal
                modal={({ closeModal }) => (
                  <ModalConfirm
                    text='Você confirma que deseja gerar um adendo para este protocolo?'
                    onConfirm={() => {
                      closeModal();
                      formProps.submitForm();
                    }}
                    onCancel={closeModal}
                  />
                )}
              >
                {({ toggleModal }) => (
                  <Tooltip hasArrow label='Criar adendo'>
                    <Button
                      mt='3'
                      colorScheme='blue'
                      type='button'
                      isLoading={isLoading || formProps.isSubmitting}
                      onClick={() => toggleModal()}
                      disabled={
                       // !formProps.values.adendo_number ||
                        //!formProps.values.adendo_description ||
                        (formProps.initialValues &&
                          formProps.initialValues.status === 0)
                      }
                    >
                      Salvar
                    </Button>
                  </Tooltip>
                )}
              </WithModal>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => ({
  isLoadingResource: isLoading(state),
  records: records(state)
});

export default connect(mapStateToProps, {
  fetchContractData
})(ContractsForm);
