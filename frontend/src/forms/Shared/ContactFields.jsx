import React from 'react';
import { Stack } from '@chakra-ui/react';
import { Field } from 'formik';
import FormField from '../../components/FormField/FormField';
import { beforeMaskedValueChangePhone } from '../../utils/formHelpers';
import { phoneValidator } from '../../utils/formValidators';

export const ContactFields = ({ readOnly, requiredFields = ['name', 'phone'] }) => (
  <>
    <Stack direction={['column', 'row']} spacing='24px'>
      <Field
        id='contact.name'
        name='contact.name'
        placeholder='Nome'
        component={FormField}
        readOnly={readOnly}
        required
      />

      <Field
        id='contact.phone'
        name='contact.phone'
        placeholder='Telemóvel'
        component={FormField.InputMask}
        mask="+351 999 999 999"
        maskChar={null}
        validate={(value) => phoneValidator(value, requiredFields.includes('phone'))}
        readOnly={readOnly}
        required
      />
    </Stack>

    <Stack direction={['column', 'row']} spacing='24px'>
      <Field
        id='contact.email'
        name='contact.email'
        placeholder='Email'
        type='email'
        component={FormField}
        readOnly={readOnly}
      />

      {requiredFields.includes('role') && (
        <Field
          id='contact.role'
          name='contact.role'
          placeholder='Função'
          component={FormField}
          readOnly={readOnly}
        />
      )}
    </Stack>
  </>
);
