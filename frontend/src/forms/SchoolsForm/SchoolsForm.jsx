import React, { useEffect, useState } from 'react';
import { Stack, Divider, Box, Button, Select } from '@chakra-ui/react';
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
import Resource from '../../components/Resource/Resource';
import { Checkbox, CheckboxGroup, Spinner, Text} from '@chakra-ui/react';
import ReactSelect from 'react-select';
import api from "../../api";


const CourseMultiSelect = ({ value = [], onChange, readOnly }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res = await api.get('/base-records?type=6');
        res = res.data.data;
        setCourses(res);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Spinner size="sm" />;

  if (error) return <div>{error}</div>;

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedValues); // Pass the selected course IDs to the parent component
  };

console.log("Courses: ", courses);

  return (
    <ReactSelect
      isMulti
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
            
            <Field name="cursos">
  {({ field, form }) => (
    <Stack>
      <Text mb={2}>Cursos</Text>
      <CourseMultiSelect
        onChange={(val) => form.setFieldValue('cursos', val)}
      />
    </Stack>
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
