import React, { useEffect, useState } from 'react';
import { Stack, Box, Button, Text, chakra, Textarea, Spinner } from '@chakra-ui/react';
import { Formik, Form, Field, FastField } from 'formik';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import Resource from '../../components/Resource/Resource';
import { makeJourneyText, weekDays } from '../../utils/formHelpers';
import AddressFields from '../Shared/AddressFields';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';
import { Select } from 'chakra-react-select';
import api from "../../api";
import CandidacyTable from '../../components/CandidacyTable/CandidacyTable';
import { useJobs } from './../../hooks/useJobs';
import CompatibleCandidacyTable from '../../components/CandidacyTable/CompatibleCandidacyTable';

const CourseSelect = ({ value = [], onChange, readOnly }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let res = await api.get('/base-records?type=6');
        setCourses(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedValues);
  };

  const selectedChakraOptions = courses.filter(course => value.includes(String(course.id))).map(course => ({ value: String(course.id), label: course.title || 'Unknown' }));
  const allChakraOptions = courses.map(course => ({ value: String(course.id), label: course.title || 'Unknown' }));

  if (loading) {
    return (
      <Box textAlign="center" py={4} w="100%">
        <Spinner size="sm" />
        <Text mt={2} fontSize="sm" color="gray.500">Carregando cursos...</Text>
      </Box>
    );
  }

  return (
    <Select
      isMulti
      isSearchable
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
      value={selectedChakraOptions}
      onChange={handleChange}
      isDisabled={readOnly}
      placeholder="Selecione os cursos"
      options={allChakraOptions}
    />
  );
};

export const JobsForm = ({ readOnly, typeForm, isLoading, ...props }) => {
  const { closeJob } = useJobs();
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const canEdit = userRole === "Administrador Geral" || userRole === 'Empresa';

  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
       initialValues={{
    ...props.initialValues,
    has_scholarship: props.initialValues?.has_scholarship ?? '1'
  }}
      onSubmit={(values) => props.onSubmit(values)}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          {['edit', 'view'].includes(typeForm) &&
            props.initialValues?.id &&
            props.initialValues?.status === 1 && (
              <Box py={3} textAlign='right'>
                <Button
                  mt='3'
                  colorScheme='red'
                  type='button'
                  onClick={() => closeJob(props.initialValues.id)}
                  isLoading={isLoading || isSubmitting}
                >
                  Encerrar vaga
                </Button>
              </Box>
            )}
          <GroupContainer
            title='Dados da vaga'
            subtitle='Informações pertinentes à empresa e à vaga'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <Resource
                resource='Companies'
                autoFetch
                resourceParams={{ perPage: 9999 }}
              >
                {({ records, isLoading }) => (
                  <Field
                    id='company_id'
                    name='company_id'
                    placeholder='Nome da empresa'
                    component={FormField.Select}
                    disabled={canEdit === false}
                    readOnly={readOnly}
                    isLoading={isLoading}
                    required
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.corporate_name} --------- {record.fantasy_name}
                      </option>
                    ))}
                  </Field>
                )}
              </Resource>
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='role'
                name='role'
                disabled={canEdit === false}
                placeholder='Função'
                component={FormField}
                readOnly={readOnly}
                required
              />
              <FastField
                id='period'
                name='period'
                placeholder='Período'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='N'>Noite</option>
                <option value='T'>Tarde</option>
                <option value='M'>Manhã</option>
                <option value='MN'>Integral</option>
              </FastField>
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <Field name="courses">
                {({ field, form }) => (
                  <Stack w="100%">
                    <Text fontWeight="semibold">Cursos</Text>
                    <CourseSelect
                      value={field.value}
                      onChange={(val) => form.setFieldValue('courses', val)}
                      readOnly={readOnly}
                      isDisabled={readOnly || !canEdit}
                    />
                  </Stack>
                )}
              </Field>
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='competences'
                name='competences'
                placeholder='Competências requeridas'
                as={Textarea}
                component={FormField.Textarea}
                readOnly={readOnly}
                disabled={canEdit === false}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                style={{ overflow: "hidden" }}
                maxLength={2000}
                required
              />
              <FastField
                id='location'
                name='location'
                placeholder='Local de realização'
                component={FormField}
                disabled={canEdit === false}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='start_at'
                name='start_at'
                placeholder='Data de Início'
                component={FormField}
                type='date'
                disabled={canEdit === false}
                readOnly={readOnly}
                required
              />
              <FastField
                id='end_at'
                name='end_at'
                placeholder='Data de Fim'
                component={FormField}
                type='date'
                disabled={canEdit === false}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='available'
                name='available'
                placeholder='Número máximo de candidaturas permitidas'
                component={FormField}
                type='number'
                readOnly={readOnly}
                required
              />
              <FastField
                id='gender'
                name='gender'
                placeholder='Sexo'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='F'>Feminino</option>
                <option value='M'>Masculino</option>
                <option value='FM'>Ambos</option>
              </FastField>
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='transport_voucher'
                name='transport_voucher'
                placeholder='Vale transporte'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>
              {values.transport_voucher === '1' && (
                <>
                  <FastField
                    id='transport_voucher_value'
                    name='transport_voucher_value'
                    placeholder='Valor do vale transporte (€)'
                    component={FormField.InputMoney}
                    readOnly={readOnly}
                    required
                  />
                  <FastField
                    id='transport_voucher_nominal_value'
                    name='transport_voucher_nominal_value'
                    placeholder='Valor nominal do vale transporte'
                    component={FormField}
                    readOnly={readOnly}
                    required
                  />
                </>
              )}
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='has_scholarship'
                name='has_scholarship'
                placeholder='Bolsa'
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>
              {values.has_scholarship === '1' && (
                <>
                  <FastField
                    id='scholarship_value'
                    name='scholarship_value'
                    placeholder='Valor da Bolsa (€)'
                    component={FormField.InputMoney}
                    readOnly={readOnly}
                    required={values.has_scholarship === '1'}
                  />
                  <FastField
                    id='scholarship_nominal_value'
                    name='scholarship_nominal_value'
                    placeholder='Valor nominal da bolsa'
                    component={FormField}
                    readOnly={readOnly}
                    required={values.has_scholarship === '1'}
                  />
                </>
              )}
            </Stack>

            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='meal_voucher'
                name='meal_voucher'
                placeholder='Vale refeição (€)'
                component={FormField.InputMoney}
                readOnly={readOnly}
                required
              />
              {/* <FastField
                id='available'
                name='available'
                disabled={canEdit === false}
                placeholder='Quantidade de vagas'
                component={FormField}
                type='number'
                readOnly={readOnly}
                required
              /> */}
            </Stack>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='type'
                name='type'
                placeholder='Tipo de vaga'
                disabled={canEdit === false}
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='ES'>Estágio</option>
                <option value='EF'>FCT</option>
              </FastField>
              {values.type === 'EF' && (
                <FastField
                  id='fct_hours'
                  name='fct_hours'
                  placeholder='Horas FCT'
                  component={FormField}
                  type='number'
                  readOnly={readOnly}
                  disabled={canEdit === false}
                  required={values.type === 'EF'}
                />
              )}
              <FastField
                id='show_web'
                name='show_web'
                placeholder='Mostrar no site'
                component={FormField.Select}
                disabled={canEdit === false}
                readOnly={readOnly}
                required
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>
            </Stack>
            <Stack direction={['column', 'row']} spacing='24px'>
              <Field
                as={Textarea}
                id='description'
                name='description'
                placeholder='Descrição da vaga'
                readOnly={readOnly}
                component={FormField.Textarea}
                disabled={canEdit === false}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                style={{ overflow: "hidden" }}
                maxLength={2000}
                required
              />
            </Stack>
          </GroupContainer>

          <GroupContainer
            title='Dados da jornada'
            subtitle='Informações pertinentes à carga horária do estagiário'
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
                  <option key={i + 1} value={i + 1}>{day}</option>
                ))}
              </FastField>
              <FastField
                id='working_day.end_weekday'
                name='working_day.end_weekday'
                placeholder='À'
                disabled={canEdit === false}
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                {weekDays.map((day, i) => (
                  <option key={i + 1} value={i + 1}>{day}</option>
                ))}
              </FastField>
            </Stack>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.start_hour'
                name='working_day.start_hour'
                placeholder='Das'
                disabled={canEdit === false}
                component={FormField}
                type='time'
                readOnly={readOnly}
              />
              <FastField
                id='working_day.end_hour'
                name='working_day.end_hour'
                placeholder='Às'
                disabled={canEdit === false}
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
                Exceção
              </chakra.div>
            </Text>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                disabled={canEdit === false}
                id='working_day.day_off_start_weekday'
                name='working_day.day_off_start_weekday'
                placeholder='De'
                component={FormField.Select}
                readOnly={readOnly}
              >
                {weekDays.map((day, i) => (
                  <option key={i + 1} value={i + 1}>{day}</option>
                ))}
              </FastField>
              <FastField
                disabled={canEdit === false}
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
                placeholder='Às'
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
                disabled={canEdit === false}
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
            {makeJourneyText(values)}
          </GroupContainer>

          {['edit', 'view'].includes(typeForm) && (
            <GroupContainer
              title='Documentos'
              subtitle='Todos anexos disponíveis para esta vaga'
            >
              <DocumentsTable
                typeForm={typeForm}
                documents={values.documents}
                {...(typeForm === 'edit' && {
                  thContent: (
                    <FileUpload
                      resource={props.resource}
                      types={['Contracts', 'Evaluation_Closes']}
                      model='Job'
                    />
                  )
                })}
              />
            </GroupContainer>
          )}

       {['edit', 'view'].includes(typeForm) && props.initialValues?.id && (
            <GroupContainer
              title='Candidaturas'
              subtitle='Todas as candidaturas para esta vaga'
            >
              <CandidacyTable
                typeForm={typeForm}
                readOnly={readOnly}
                jobId={props.initialValues.id}
                candidates={props.initialValues.candidates}
              />
            </GroupContainer>
          )}

          {['edit', 'view'].includes(typeForm) && props.initialValues?.id && (
            <GroupContainer
              title='Candidatos compativeis'
              subtitle='Todos os candidatos compativeis para esta vaga'
            >
              <CompatibleCandidacyTable
                typeForm={typeForm}
                readOnly={readOnly}
                jobId={props.initialValues.id}
                candidates={props.initialValues.compatible_candidates}
              />
            </GroupContainer>
          )}

          {readOnly !== true && (
            <Box py={3} textAlign='right'>
              <Button
                mt='3'
                colorScheme='blue'
                type='submit'
                isLoading={isLoading || isSubmitting}
              >
                Salvar
              </Button>
              <Button
                mt='3'
                ml={3}
                colorScheme='orange'
                type='submit'
                isLoading={isLoading || isSubmitting}
              >
                Salvar como Rascunho
              </Button>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default JobsForm;