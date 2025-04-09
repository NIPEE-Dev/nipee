import React, { useState, useEffect } from 'react';
import _range from 'lodash/range';
import { Formik, FastField, Form, Field } from 'formik';
import { Box, Button, Divider, Stack } from '@chakra-ui/react';
import FormField from '../../components/FormField/FormField';
import GroupContainer from '../GroupContainer';
import { ResponsibleFields } from '../Shared/ResponsibleFields';
import { ContactFields } from '../Shared/ContactFields';
import AddressFields from '../Shared/AddressFields';
import { cnpjMask, cpfMask } from '../../utils/formHelpers';
import DocumentsTable from '../../components/DocumentsTable/DocumentsTable';
import FileUpload from '../../components/FileUpload/FileUpload';
import Resource from '../../components/Resource/Resource';
import { cnpjValidator, cpfValidator, nifValidator } from '../../utils/formValidators';

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
           
          {/* <FastField
              id="type"
              name="type"
              placeholder="Tipo"
              component={FormField.Select}
              readOnly={readOnly}
              required
              value={values.type}
            >
              <option value="PJ">Pessoa Jurídica</option>
              <option value="PF">Pessoa Física</option>
            </FastField> */}
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px'>
            <FastField
                  id='cnpj'
                  name='cnpj'
                  placeholder='NIF/NIPC'
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
            {/* <FastField
              id='start_contract_vigence'
              name='start_contract_vigence'
              placeholder='Início do protocolo'
              component={FormField}
              type='date'
              readOnly={readOnly}
            /> */}

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
          title='Dados do endereço'
          subtitle='Localidade em que a empresa fica sediada.'
        >
          <AddressFields readOnly={readOnly} setFieldValue={setFieldValue} />
        </GroupContainer>

        <Divider my={25} />

        
          <Stack direction={['column', 'row']} spacing='24px' display={'none'}>
            <Resource resource='Sellers' autoFetch>
              {({ records, isLoading }) => (
                <Field
                  id='billing.seller_id'
                  name='billing.seller_id'
                  placeholder='Vendedor'
                  component={FormField.Select}
                  readOnly={readOnly}
                  isLoading={isLoading}
                  required
                >
                  {records.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.name}
                    </option>
                  ))}
                </Field>
              )}
            </Resource>

            <FastField
              id='billing.colocacao'
              name='billing.colocacao'
              placeholder='Adesão (€)'
              component={FormField.InputMoney}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px' display={'none'}>
            <FastField
              id='billing.monthly_payment'
              name='billing.monthly_payment'
              placeholder='Mensalidade/Estagiário'
              component={FormField.InputMoney}
              readOnly={readOnly}
              required
            />

            <FastField
              id='billing.email'
              name='billing.email'
              placeholder='Email'
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px' display={'none'}>
            <FastField
              id='billing.due_date'
              name='billing.due_date'
              placeholder='Vencimento'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              {_range(1, 31).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </FastField>

            <FastField
              id='billing.business_day'
              name='billing.business_day'
              placeholder='Dia útil?'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              <option value='1'>Sim</option>
              <option value='0'>Não</option>
            </FastField>
          </Stack>

          <Stack direction={['column', 'row']} spacing='24px' display={'none'}>
            <FastField
              id='billing.issue_invoice'
              name='billing.issue_invoice'
              placeholder='Emite NF?'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              <option value='1'>Sim</option>
              <option value='0'>Não</option>
            </FastField>

            <FastField
              id='billing.issue_bank_slip'
              name='billing.issue_bank_slip'
              placeholder='Emite Boleto?'
              component={FormField.Select}
              readOnly={readOnly}
              required
            >
              <option value='1'>Sim</option>
              <option value='0'>Não</option>
            </FastField>
          </Stack>
     
        <Divider my={25} />

        <GroupContainer
          title='Dados do responsável'
          subtitle='Pessoa que iremos tratar em relação a esta empresa'
        >
          <ResponsibleFields
            requiredFields={['name', 'phone', 'email']}
            readOnly={readOnly}
          />
        </GroupContainer>

        <Divider my={25} />

        <GroupContainer
          title='Dados do contacto'
          subtitle='Preencha os dados que serão usados para entrar em contacto com a empresa.'
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
                    model='Company'
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
