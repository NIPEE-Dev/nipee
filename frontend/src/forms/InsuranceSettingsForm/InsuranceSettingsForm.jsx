import React from 'react';
import { FastField, Form, Formik } from 'formik';
import { Box, Button, Stack } from '@chakra-ui/react';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';

export const InsuranceSettingsForm = ({ readOnly, isLoading, ...props }) => (
  <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={props.initialValues}
    onSubmit={(values) => props.onSubmit(values)}
  >
    {({ dirty, isSubmitting }) => (
      <Form>
        <GroupContainer
          title='Dados do seguro'
          subtitle='Configure ao lado a apolice e subestipulante para serem utilizados nos protocolos.'
        >
          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='apolice'
              name='apolice'
              placeholder='Apólice'
              component={FormField}
              readOnly={readOnly}
              required
            />

            <FastField
              id='subestipulante'
              name='subestipulante'
              placeholder='Subestipulante'
              component={FormField}
              readOnly={readOnly}
            />
          </Stack>
        </GroupContainer>

        {readOnly !== true && (
          <Box py={3} textAlign='right'>
            <Button
              mt='3'
              colorScheme='blue'
              type='submit'
              isLoading={isLoading || isSubmitting}
              disabled={!dirty}
            >
              Enviar
            </Button>
          </Box>
        )}
      </Form>
    )}
  </Formik>
);
