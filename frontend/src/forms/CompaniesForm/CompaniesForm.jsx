import React from 'react';
import _range from 'lodash/range';
import { Formik, FastField, Form, useFormikContext } from 'formik';
import { Box, Button, Divider, Stack, Checkbox } from '@chakra-ui/react';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import { ResponsibleFields } from '../Shared/ResponsibleFields';
import { ContactFields } from '../Shared/ContactFields';
import AddressFields from '../Shared/AddressFields';
import { cnpjMask } from '../../utils/formHelpers';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';
import Resource from '../../components/Resource/Resource';
import { nifValidator } from '../../utils/formValidators';

// Componente Checkbox para copiar dados do responsável para contato
const CopyResponsibleCheckbox = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFieldValue('contact.name', values.responsible?.name || '');
      setFieldValue('contact.phone', values.responsible?.phone || '');
      setFieldValue('contact.role', values.responsible?.role || '');
      setFieldValue('contact.email', values.responsible?.email || '');
    } else {
      setFieldValue('contact.name', '');
      setFieldValue('contact.phone', '');
      setFieldValue('contact.role', '');
      setFieldValue('contact.email', '');
    }
  };

  return (
    <Checkbox mt={-2} onChange={handleChange}>
      Utilizar dados do responsável para o contacto
    </Checkbox>
  );
};

export const CompaniesForm = ({
  readOnly,
  isLoading,
  typeForm,
  fetchSellers,
  requiredFields = ['name', 'phone'],
  ...props
}) => (
  <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={{
      ...props.initialValues,
      type: props.initialValues.type || 'PJ',
      billing: {
        seller_id: props.initialValues?.billing?.seller_id || '26',
        colocacao: props.initialValues?.billing?.colocacao || '100.00',
        monthly_payment: props.initialValues?.billing?.monthly_payment || '50.00',
        email: props.initialValues?.billing?.email || 'email@example.com',
        due_date: props.initialValues?.billing?.due_date || '10',
        business_day: props.initialValues?.billing?.business_day ?? '1',
        issue_invoice: props.initialValues?.billing?.issue_invoice ?? '0',
        issue_bank_slip: props.initialValues?.billing?.issue_bank_slip ?? '1',
      }
    }}
    onSubmit={(values) => props.onSubmit(values)}
  >
    {({ values, setFieldValue, isSubmitting }) => (
      <Form>
        <GroupContainer
          title='Dados da empresa'
          subtitle='Preencha todos corretamente para evitar problemas no protocolo.'
        >
          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='fantasy_name'
              name='fantasy_name'
              placeholder='Nome da Entidade'
              component={FormField}
              readOnly={readOnly}
              required
            />
            <FastField
              id='corporate_name'
              name='corporate_name'
              placeholder='Registo Comercial'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='branch_of_activity'
              name='branch_of_activity'
              placeholder='Ramo da atividade'
              component={FormField}
              readOnly={readOnly}
              required
            />
            <FastField
              id='supervisor'
              name='supervisor'
              placeholder='Supervisor'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            {/* Campos adicionais, se precisar */}
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='cnpj'
              name='cnpj'
              placeholder='NIPC'
              component={FormField.InputMask}
              mask={cnpjMask}
              readOnly={readOnly}
              validate={(value) => nifValidator(value, true)}
              required
            />
            <FastField
              id='cae'
              name='cae'
              placeholder='CAE'
              component={FormField}
              readOnly={readOnly}
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
              id='observations'
              name='observations'
              placeholder='Ramo de atividade da empresa'
              component={FormField.Textarea}
              readOnly={readOnly}
            />
          </Stack>
        </GroupContainer>

        <Divider my={25} />

        <GroupContainer
          title='Dados da morada'
          subtitle='Localidade em que a empresa fica sediada.'
        >
          <AddressFields readOnly={readOnly} setFieldValue={setFieldValue} />
        </GroupContainer>

        <Divider my={25} />

        {/* Outros campos ocultos para billing ... */}

        <Divider my={25} />

        <GroupContainer
          title='Dados do responsável'
          subtitle='Pessoa que iremos tratar em relação a esta empresa'
        >
          <ResponsibleFields
            requiredFields={['name', 'phone', 'email', 'role', 'document']}
            readOnly={readOnly}
          />
        </GroupContainer>

        {/* Checkbox para copiar dados do responsável para contato */}

        <Divider my={25} />

        <GroupContainer
          title='Dados do contacto'
          subtitle='Preencha os dados que serão usados para entrar em contacto com a empresa.'
        >
          <CopyResponsibleCheckbox />
          <ContactFields
            requiredFields={['name', 'phone', 'role', 'email']}
            readOnly={readOnly}
          />
          
        </GroupContainer>

        {(typeForm === 'edit' || typeForm === 'view') && (
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
                    model='Company'
                  />
                )
              })}
            />
          </GroupContainer>
        )}

        {props.children}
      </Form>
    )}
  </Formik>
);
