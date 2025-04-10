import React, { useEffect } from 'react';
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
  Tooltip
} from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';
import { FastField, Field, Form, Formik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import {
  beforeMaskedValueChangePhone,
  cpfMask,
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

    if (candidate) {
      setFieldValue('candidate', candidate, true);
      setFieldValue('userAddress', candidate.address, true);
      setFieldValue('candidate.name', candidate.id, true);
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
        retroative_billing: props.initialValues?.retroative_billing || '0',
      }}
      onSubmit={(values) => props.onSubmit(values)}
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
                    placeholder='Nome da empresa'
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
                autoFetch={ formProps.values.candidate }
                resourceParams={{
                  perPage: 9999,
                  schoolId: formProps.values.candidate && formProps.values.candidate.user && formProps.values.candidate.user.school && formProps.values.candidate.user.school[0] ? formProps.values.candidate.user.school[0].id : null,
                  ...(typeForm === 'add' && { withoutTrashed: true })
                }}
              >
                {({ records, isLoading }) => (
                  <Field
                    id={
                      typeForm === 'edit' ? 'school_id' : 'candidate.school.id'
                    }
                    name={
                      typeForm === 'edit' ? 'school_id' : 'candidate.school.id'
                    }
                    as="select"
                    disabled={formProps.values.candidate && formProps.values.candidate.user && formProps.values.candidate.user.school && formProps.values.candidate.user.school[0] && records.length > 0 ? false : true}
                    placeholder='Nome da Escola'
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
              {({ records, isLoading }) => (
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
                      {record.role?.title}
                    </option>
                  ))}
                  {records.length === 0 && (
                    <option disabled>
                      Nenhuma vaga disponível para esta empresa
                    </option>
                  )}
                </Field>
              )}
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
                  autoFetch
                  resourceParams={{
                    perPage: 99999,
                    ...(typeForm === 'add' && { withoutTrashed: true })
                  }}
                >
                  {({ records, isLoading }) => (
                    <Field
                      id='candidate.name'
                      name='candidate.name'
                      placeholder='Nome do candidato'
                      component={FormField.Select}
                      isLoading={isLoading}
                      readOnly={readOnly}
                      onChangeCallback={(e) =>
                        handleCandidateChange(
                          formProps.setFieldValue,
                          records,
                          e.target.value
                        )
                      }
                      required
                    >
                      {records.map((record) => (
                        <option key={record.id} value={record.id}>
                          {record.name}
                        </option>
                      ))}
                    </Field>
                  )}
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
                placeholder='BI / Passaport / Residecia'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='candidate.studying_level'
                name='candidate.studying_level'
                placeholder='Cursando'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='M'>Técnico</option>
                <option value='E'>Ensino Secundário</option>
                <option value='TS'>Superior</option>
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
              {formProps.values?.candidate?.studying_level === 'E' ? (
                <FastField
                  id='candidate.serie'
                  name='candidate.serie'
                  placeholder='Série'
                  component={FormField.Select}
                  readOnly={readOnly}
                  required
                >
                  <optgroup label='Ensino Secundário'>
                    <option value={11}>1° Série</option>
                    <option value={12}>2° Série</option>
                    <option value={13}>3° Série</option>
                  </optgroup>

                  <optgroup label='Outros'>
                    <option value={14}>1° Ano Supletivo</option>
                    <option value={15}>2° Ano Supletivo</option>
                    <option value={16}>3° Ano Supletivo</option>
                  </optgroup>
                </FastField>
              ) : (
                <>
                  <Resource
                    resource='BaseRecords'
                    autoFetch
                    resourceParams={{
                      type: 6,
                      perPage: 9999,
                      ...(typeForm === 'add' && { withoutTrashed: true })
                    }}
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
                    placeholder='Semestre'
                    component={FormField.Select}
                    readOnly={readOnly}
                  >
                    {[...Array(32).keys()].map((v) => (
                      <option key={v} value={v}>
                        {++v}° Semestre
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
            title='Endereço do candidato'
            subtitle='Dados pertinente a localização da moradia do candidato.'
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
            title='Dados da jornada'
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
              <chakra.div
                textAlign='center'
                userSelect='none'
                color='gray.500'
                width='140px'
              >
                Folga
              </chakra.div>
            </Text>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.day_off'
                name='working_day.day_off'
                placeholder='Folga'
                component={FormField}
                readOnly={readOnly}
                required
              />

              <FastField
                id='working_day.working_hours'
                name='working_day.working_hours'
                placeholder='Horas semanais'
                component={FormField}
                type='number'
                readOnly={readOnly}
                required
              />
            </Stack>
            {makeJourneyText(formProps.values)}
          </GroupContainer>

          <GroupContainer
            title='Dados do protocolo'
            subtitle='Dados pertinentes aos dados cruciais do protocolo, como data e se tem cobrança retroativa'
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
          </GroupContainer>

          <GroupContainer title='Dados do seguro' subtitle=''>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='insurance_date'
                name='insurance_date'
                placeholder='Data do seguro'
                component={FormField}
                type='date'
                readOnly={readOnly}
                required
              />
            </Stack>
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

          {typeForm === 'add' && (
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
