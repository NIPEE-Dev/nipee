import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Box, Button, Stack } from '@chakra-ui/react';
import GroupContainer from '../GroupContainer';
import FormField from '../../components/FormField/FormField';

export const FinancialForm = ({ readOnly, isLoading, ...props }) => (
  <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={props.initialValues}
    onSubmit={(values) => props.onSubmit(values)}
  >
    <Form>
      <GroupContainer
        title='Fechamento'
        subtitle='É levado em consideração todos protocolos ativos, empresas com débitos pendentes ou protocolos rescindidos que precisam ser pagos no mês atual'
      >
        <Stack direction={['column', 'row']} spacing='24px'>
          <Field
            id='reference_date'
            name='reference_date'
            placeholder='Data de referência'
            type='month'
            component={FormField}
            readOnly={readOnly}
            required
          />
        </Stack>
      </GroupContainer>

      {readOnly !== true && (
        <Box py={3} textAlign='right'>
          <Button mt='3' colorScheme='blue' type='submit' isLoading={isLoading}>
            Enviar
          </Button>
        </Box>
      )}
    </Form>
  </Formik>
);
