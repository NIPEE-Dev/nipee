import React from 'react';
import { Stack, Box, Button, Text, chakra, Textarea, useToast } from '@chakra-ui/react';
import { Formik, Form, Field, FastField } from 'formik';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import Resource from '../../components/Resource/Resource';
import { makeJourneyText, weekDays } from '../../utils/formHelpers';
import AddressFields from '../Shared/AddressFields';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';

export const JobsForm = ({ readOnly, typeForm, isLoading, ...props }) => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const canEdit = userRole === "Administrador Geral" || userRole === 'Empresa';
  const toast = useToast();
  
  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
      initialValues={props.initialValues}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
    try {
      await props.onSubmit(values);
      toast({
        title: "Sucesso",
        description: "Dados salvo com sucesso!",
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
      {({ values, isSubmitting }) => (
        <Form>
          <GroupContainer
            title='Dados da vaga'
            subtitle='Informações pertinentes a empresa e a vaga'
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
              <Resource
                resource='BaseRecords'
                autoFetch
                resourceParams={{ type: 1, perPage: 9999 }}
              >
                {({ records, isLoading }) => (
                  <Field
                    id='role_id'
                    name='role_id'
                    disabled={canEdit === false}
                    placeholder='Função'
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
                id='period'
                disabled={canEdit === false}
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
              <FastField
                id='gender'
                disabled={canEdit === false}
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
              <FastField
                id='transport_voucher'
                name='transport_voucher'
                placeholder='Vale transporte'
                disabled={canEdit === false}
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                <option value='0'>Não</option>
                <option value='1'>Sim</option>
              </FastField>
            </Stack>
            {values.transport_voucher === '1' && (
              <Stack direction={['column', 'row']} spacing='24px'>
                <FastField
                  id='transport_voucher_value'
                  name='transport_voucher_value'
                  disabled={canEdit === false}
                  placeholder='Valor do vale transporte (€)'
                  component={FormField.InputMoney}
                  readOnly={readOnly}
                />
                <FastField
                  id='transport_voucher_nominal_value'
                  name='transport_voucher_nominal_value'
                  disabled={canEdit === false}
                  placeholder='Valor nominal do vale transporte'
                  component={FormField}
                  readOnly={readOnly}
                />
              </Stack>
            )}
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='scholarship_value'
                name='scholarship_value'
                placeholder='Bolsa (€)'
                disabled={canEdit === false}
                component={FormField.InputMoney}
                readOnly={readOnly}
                required
              />
              <FastField
                id='scholarship_nominal_value'
                name='scholarship_nominal_value'
                placeholder='Vale nominal da bolsa'
                disabled={canEdit === false}
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='meal_voucher'
                name='meal_voucher'
                placeholder='Vale refeição (€)'
                disabled={canEdit === false}
                component={FormField.InputMoney}
                readOnly={readOnly}
                required
              />
              <FastField
                id='available'
                name='available'
                disabled={canEdit === false}
                placeholder='Quantidade de vagas'
                component={FormField}
                readOnly={readOnly}
                required
              />
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
              />
            </Stack>
          </GroupContainer>
          <GroupContainer
            title='Dados da jornada'
            subtitle='Informações pertinentes a carga horária do estagiário'
          >
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='working_day.start_weekday'
                name='working_day.start_weekday'
                placeholder='De'
                component={FormField.Select}
                disabled={canEdit === false}
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
                placeholder='Á'
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
                placeholder='As'
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
                Excessão
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
                disabled={canEdit === false}
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
                disabled={canEdit === false}
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
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default JobsForm;