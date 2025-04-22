import React, { useEffect, useState } from 'react';
import { Stack, Divider, Box, Button } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import AddressFields from '../Shared/AddressFields';
import { ResponsibleFields } from '../Shared/ResponsibleFields';
import { ContactFields } from '../Shared/ContactFields';
import { cnpjMask } from '../../utils/formHelpers';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';
import { nifValidator } from '../../utils/formValidators';
import {Text} from '@chakra-ui/react';
import {Select} from 'chakra-react-select';
import api from "../../api";


const CourseSelect = ({ value = [], onChange, readOnly }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res = await api.get('/base-records?type=6');
        setCourses(res.data.data);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      } 
    };
    fetchCourses();
  }, []);

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedValues);
  };

  return (
    <Select
      w="100%"
      isMulti
      isSearchable
      value={courses.filter(course => value.includes(String(course.id))).map(course => ({ value: String(course.id), label: course.title || 'Unknown' }))}
      onChange={handleChange}
      isDisabled={readOnly}
      placeholder="Selecione os cursos"
      options={courses.map(course => {
        return { value: String(course.id), label: course.title || 'Unknown' };
      })}
    />
  );
};

export const SchoolsForm = ({ readOnly, isLoading, typeForm, ...props }) => (
  <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={props.initialValues} 
    onSubmit={(values) => props.onSubmit(values)}
  >
    {({ values, setFieldValue, isSubmitting }) => (
      <Form>
        <GroupContainer
          title='Dados da escola'
          subtitle='Informações pertinentes a escola'
        >
          <Stack direction={['column', 'row']} spacing='24px'>
            <Field
              id='fantasy_name'
              name='fantasy_name'
              placeholder='Nome da Instituição'
              component={FormField}
              readOnly={readOnly}
              required
            />

            <Field
              id='corporate_name'
              name='corporate_name'
              placeholder='Nome do Agrupamento'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px' mt={5}>
            <Field
              id='cnpj'
              name='cnpj'
              placeholder='NIF'
              component={FormField.InputMask}
              mask={cnpjMask}
              readOnly={readOnly}
              validate={(value) => nifValidator(value, false)}
            />

            <Field
              id='cae'
              name='cae'
              placeholder='CAE'
              component={FormField}
              readOnly={readOnly}
            />
            </Stack>
            <Stack direction={['column', 'row']} spacing='24px' mt={5}>
            <Field name="courses">
              {({ field, form }) => (
                <>
                  <Stack w="100%">
                    <Text fontWeight="semibold">Cursos</Text>
                    <CourseSelect
                      value={field.value}
                      onChange={(val) => form.setFieldValue('courses', val)}
                    />
                  </Stack>
                </>
              )}
            </Field>

          </Stack>
        </GroupContainer>

        <Divider my={25} />

        <GroupContainer
          title='Dados da morada'
          subtitle='Localidade em que a escola fica sediada.'
        >
          <AddressFields readOnly={readOnly} setFieldValue={setFieldValue} />
        </GroupContainer>

        <Divider my={25} />

        <GroupContainer
          title='Dados do responsável'
          subtitle='Pessoa que iremos tratar em relação a esta escola'
        >
          <ResponsibleFields readOnly={readOnly} />
        </GroupContainer>

        <Divider my={25} />

        <GroupContainer
          title='Dados do contacto'
          subtitle='Preencha os dados que serão usados para entrar em contacto com a escola.'
        >
          <ContactFields requiredFields={['name', 'phone', 'role']} readonly={readOnly} />
        </GroupContainer>

        {['edit', 'view'].includes(typeForm) && (
          <GroupContainer
            title='Documentos'
            subtitle='Todos anexos disponíveis para este protocolo'
          >
            <DocumentsTable
              typeForm={typeForm}
              documents={values.documents}
              {...(typeForm === 'edit' && {
                thContent: (
                  <FileUpload
                    resource={props.resource}
                    types={['Contracts']}
                    model='School'
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

export default SchoolsForm;
