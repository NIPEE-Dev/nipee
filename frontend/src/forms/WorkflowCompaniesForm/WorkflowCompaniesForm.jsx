import React, { useState, useEffect } from 'react';
import _range from 'lodash/range';
import { Formik, FastField, Form, Field } from 'formik';
import { Box, Button, Divider, Stack } from '@chakra-ui/react';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import { cnpjMask, beforeMaskedValueChangePhone } from '../../utils/formHelpers';
import { nifValidator, phoneValidator } from '../../utils/formValidators';

export const WorkflowCompaniesForm = ({
  readOnly,
  isLoading,
  typeForm,
  fetchSellers,
  ...props
}) => (
  <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={props.initialValues}
    onSubmit={(values) => props.onSubmit({ empresa: values })}
  >
    {({ values, setFieldValue, isSubmitting }) => (
      <Form>
        <GroupContainer
          title='Dados da empresa'
          subtitle='Preencha todos corretamente para evitar problemas no protocolo.'
        >
          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='company_name'
              name='company_name'
              placeholder='Nome da Entidade'
              component={FormField}
              readOnly={readOnly}
              required
            />

            <FastField
              id='representative_name'
              name='representative_name'
              placeholder='Representante da Entidade'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
           
            <FastField
              id='sector'
              name='sector'
              placeholder='Setor de atuação'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              <option value="TI">TI</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Comércio">Comércio</option>
              <option value="Outro">Outro</option>
            </FastField>

            <FastField
              id='student_vacancies'
              name='student_vacancies'
              placeholder='Vagas para candidatos'
              component={FormField}
              readOnly={readOnly}
            />
            
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
                id='nif'
                name='nif'
                placeholder='NIF'
                component={FormField.InputMask}
                mask={cnpjMask}
                readOnly={readOnly}
                validate={(value) => nifValidator(value, true)}
                required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
                id='phone'
                name='phone'
                placeholder='Telemóvel'
                component={FormField.InputMask}
                mask="+351 999 999 999"
                maskChar={undefined}
                beforeMaskedValueChange={beforeMaskedValueChangePhone}
                validate={(value) => phoneValidator(value, true)}
                readOnly={readOnly}
            />

            <FastField
              id='corporate_email'
              name='corporate_email'
              placeholder='E-mail corporativo'
              type='email'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='message'
              name='message'
              placeholder='Ramo de atividade da empresa'
              component={FormField.Textarea}
              readOnly={readOnly}
            />
          </Stack>
        </GroupContainer>

        {/* <Divider my={25} /> */}

        {props.children}
      </Form>
    )}
  </Formik>
);
