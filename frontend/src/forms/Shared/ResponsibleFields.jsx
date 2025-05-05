import React from 'react';
import { Stack } from '@chakra-ui/react';
import { Field } from 'formik';
import FormField from '../../components/FormField/FormField';
import { beforeMaskedValueChangePhone } from '../../utils/formHelpers';
import { phoneValidator, birthDayValidator } from '../../utils/formValidators';

export const ResponsibleFields = ({
  readOnly,
  requiredFields = ['name', 'phone']
}) => (
  <>
    <Stack direction={['column', 'row']} spacing="24px">
      <Field
        id="responsible.name"
        name="responsible.name"
        placeholder="Nome"
        component={FormField}
        readOnly={readOnly}
        required={requiredFields.includes('name')}
      />

      <Field
        id="responsible.phone"
        name="responsible.phone"
        placeholder="Telemóvel"
        component={FormField.InputMask}
        mask="+351 999 999 999"
        maskChar={null}
        validate={(value) => phoneValidator(value, requiredFields.includes('phone'))}
        readOnly={readOnly}
        required={requiredFields.includes('phone')}
      />

    </Stack>

    <Stack direction={['column', 'row']} spacing="24px">
      <Field
        id="responsible.email"
        name="responsible.email"
        placeholder="Email"
        type="email"
        component={FormField}
        readOnly={readOnly}
        required={requiredFields.includes('email')}
      />

      <Field
        id="responsible.role"
        name="responsible.role"
        placeholder="Função"
        component={FormField}
        readOnly={readOnly}
        required={requiredFields.includes('role')}
      />
    </Stack>

    <Stack direction={['column', 'row']} spacing="24px">
    <Field
  id="responsible.document"
  name="responsible.document"
  placeholder="NIF"
  component={FormField}
  readOnly={readOnly}
  required={requiredFields.includes('document')}
  inputMode="numeric"         // mostra apenas o teclado numérico em mobile
  pattern="[0-9]*"            // restringe a entrada para apenas números
/>


        <Field
          id='validade'
          name='responsible.validade'
          type='date'
          placeholder='Validade'
          component={FormField}
          readOnly={readOnly}
        />

      <Field
        id="responsible.birth_day"
        name="responsible.birth_day"
        placeholder="Data de nascimento"
        component={FormField.InputMask}
        mask="99/99/9999"
        readOnly={readOnly}
        required={requiredFields.includes('birth_day')}
        validate={(value) =>
          birthDayValidator(value, requiredFields.includes('birth_day'))
        }
      />
    </Stack>
  </>
);
