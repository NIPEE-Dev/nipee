import React from 'react';
import { Stack, Box, useColorModeValue, Button } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';

export const BaseRecordsForm = ({ readOnly, isLoading, ...props }) => {
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const userRole = userProfile?.role || '';
  const isEmpresa = userRole === "Empresa";

  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
      initialValues={props.initialValues}
      onSubmit={(values) => props.onSubmit(values)}
    >
      <Form>
        <GroupContainer
          title='Dados do registo base'
          subtitle='Informações pertinentes a escola de emprego ou estágio'
        >
          <Stack direction={['column', 'row']} spacing='24px'>
            <Field
              id='type'
              name='type'
              placeholder='Tipo de registo'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              {isEmpresa ? (
                <option value={1}>Funções</option> 
              ) : (
                <>
                  <option value={1}>Funções</option>
                  <option value={2}>Como nos conheceu</option>
                  <option value={3}>Motivo de rescisão</option>
                  <option value={4}>Motivos de reprovação</option>
                  <option value={5}>Feriados</option>
                  <option value={6}>Cursos</option>
                </>
              )}
            </Field>

            <Field
              id='title'
              name='title'
              placeholder='Titulo'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>
        </GroupContainer>
        {props.children}
      </Form>
    </Formik>
  );
};
