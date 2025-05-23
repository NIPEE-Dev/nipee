import React from 'react';
import { Stack } from '@chakra-ui/react';
import { Field } from 'formik';
import FormField from '../../components/FormField/FormField';
import { beforeMaskedValueChangePhone } from '../../utils/formHelpers';
import { phoneValidator, birthDayValidator } from '../../utils/formValidators';


// Função para validar NIF usando seu nifValidator
const validateNIF = (value) => {
  if (!value) return 'NIF é obrigatório';
  // O nifValidator deve retornar string com erro ou undefined/null se OK
  const error = nifValidator(value, true); 
  if (error) return error;
  return undefined;
};

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
  id="responsible.document"
  name="responsible.document"
  placeholder="NIF"
  component={FormField}
  readOnly={readOnly}
  required={requiredFields.includes('document')}
  inputMode="numeric"         // mostra apenas o teclado numérico em mobile
  pattern="[0-9]*"            // restringe a entrada para apenas números
    validate={validateNIF}
/>

      
    </Stack>

    <Stack direction={['column', 'row']} spacing="24px">
  
<Field
        id="responsible.role"
        name="responsible.role"
        placeholder="Função"
        component={FormField}
        readOnly={readOnly}
        required={requiredFields.includes('role')}
      />



    </Stack>
  </>
);
