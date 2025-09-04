import React from "react";
import { Formik, Field, Form } from "formik";
import { Button, Divider, Stack } from "@chakra-ui/react";
import FormField from "../../components/FormField/FormField";
import PermissionAction from "../../components/Permission/PermissionAction";
import Resource from "../../components/Resource/Resource";

function validateUsername(value) {
  let error;
  if (value === "admin") {
    error = "Admin não pode não, sô!!";
  }

  return error;
}

export const UsersForm = ({ readOnly, isLoading, ...props }) => (
  <div>
   <Formik
    enableReinitialize
    initialErrors={props.initialErrors}
    initialValues={{
      start_hour: props.initialValues?.start_hour || "00:00",
      end_hour: props.initialValues?.end_hour || "23:59",
      ...props.initialValues
    }}
    onSubmit={(values) => props.onSubmit(values)}
  >
      {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
        <Form>
          <Stack direction={["column", "row"]} spacing="24px">
            <Field
              id="name"
              name="name"
              placeholder="Nome do usuario"
              component={FormField}
              validate={validateUsername}
              readOnly={readOnly}
              required
            />

            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email do usuario"
              component={FormField}
              readOnly={readOnly}
              required
            />

            {/* <Field
              id='commission'
              name='commission'
              type='number'
              placeholder='Comissão do usuário'
              component={FormField}
              min={0}
              step={0.1}
              readOnly={readOnly}
            /> */}
          </Stack>

          <Stack direction={["column", "row"]} spacing="24px">
            <PermissionAction permission="roles.index">
              <Resource
                resource="Roles"
                resourceParams={{ perPage: 1000 }}
                autoFetch
              >
                {({ records, isLoading }) => (
                  <Field
                    id="role"
                    name="role"
                    placeholder="Perfil"
                    component={FormField.Select}
                    readOnly={readOnly}
                    isLoading={isLoading}
                    required
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.label}
                      </option>
                    ))}
                  </Field>
                )}
              </Resource>
            </PermissionAction>

            <Field
              id="password"
              name="password"
              placeholder="Senha do usuario"
              component={FormField}
              readOnly={readOnly}
              type="password"
            />
          </Stack>
          { values.role === '10' && (
            <Resource
              resource="Schools"
              autoFetch
              resourceParams={{
                perPage: 9999,
                // ...(typeForm === 'add' && { withoutTrashed: true })
              }}
            >
              {({ records, isLoading }) => (
                <Field
                  id="school_id"
                  name="school_id"
                  as="select"
                  placeholder="Nome da Escola"
                  component={FormField.Select}
                  readOnly={readOnly}
                  isLoading={isLoading}
                  required
                >
                  {records.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.corporate_name} --------- {record.fantasy_name} #
                      {record.id}
                    </option>
                  ))}
                </Field>
              )}
            </Resource>
          ) }

          <Divider my={5} />

          <Stack direction={["column", "row"]} spacing="24px" display={"none"}>
            <Field
              id="start_hour"
              name="start_hour"
              type="time"
              placeholder="Horário de entrada"
              component={FormField}
              readOnly={readOnly}
              required
            />

            <Field
              id="end_hour"
              name="end_hour"
              type="time"
              placeholder="Horário de Saída"
              component={FormField}
              readOnly={readOnly}
              required
            />
          </Stack>

          {readOnly !== true && (
            <Button mt="3" type="submit" isLoading={isLoading}>
              Salvar
            </Button>
          )}
        </Form>
      )}
    </Formik>
  </div>
);
