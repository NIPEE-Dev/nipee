import React, { useState } from "react";
import { Formik, FastField, Form, Field } from "formik";
import { Box, Button, Divider, Stack } from "@chakra-ui/react";
import FormField from "../../components/FormField/FormField";
import GroupContainer from "../GroupContainer";
import {
  cnpjMask,
  beforeMaskedValueChangePhone,
} from "../../utils/formHelpers";
import { nifValidator, phoneValidator } from "../../utils/formValidators";

export const WorkflowCandidatesForm = ({
  readOnly,
  isLoading,
  typeForm,
  ...props
}) => {
  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
      initialValues={props.initialValues}
      onSubmit={(values) => {
        console.log("Form submitted with values:", values);
        props.onSubmit(values);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <GroupContainer
            title="Dados do candidato"
            subtitle="Dados pessoais do candidato as oportunidades."
          >
            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="full_name"
                name="full_name"
                placeholder="Nome do canditado"
                component={FormField}
                readOnly={readOnly}
                required
              />

              <FastField
                id="birth_date"
                name="birth_date"
                placeholder="Data de nascimento"
                component={FormField.InputMask}
                mask="99/99/9999"
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="phone"
                name="phone"
                placeholder="Telemóvel"
                component={FormField.InputMask}
                mask="+351 999 999 999"
                maskChar={undefined}
                beforeMaskedValueChange={beforeMaskedValueChangePhone}
                validate={(value) => phoneValidator(value, true)}
                readOnly={readOnly}
              />

              <FastField
                id="email"
                name="email"
                placeholder="E-mail"
                type="email"
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="education_level"
                name="education_level"
                placeholder="Nível de Ensino"
                component={FormField.Select}
                readOnly={readOnly}
                required
              >
                {/* <option value='CP4'>Cursos Profissionais nível 4 </option> */}
                <option value="E">
                  Cursos Profissionais nível 4 / Ensino Secundário
                </option>
                <option value="CP5">Cursos Profissionais CET nível 5</option>
                <option value="TS">Superior</option>
                <option value="TESP">TESP nível 5</option>
              </FastField>

              <FastField
                id="interest_area"
                name="interest_area"
                placeholder="Áreas de interesses"
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="nif"
                name="nif"
                placeholder="NIF"
                component={FormField.InputMask}
                mask={cnpjMask}
                readOnly={readOnly}
                validate={(value) => nifValidator(value, true)}
                required
              />
            </Stack>

            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="school.fantasy_name"
                name="school.fantasy_name"
                placeholder="Escola"
                component={FormField}
                readOnly={readOnly}
                required
              />
              <FastField
                id="course.title"
                name="course.title"
                placeholder="Curso"
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Stack direction={["column", "row"]} spacing="24px">
              <FastField
                id="volunteer_experience"
                name="volunteer_experience"
                placeholder="Participa ou participou de voluntariado? Descreva"
                component={FormField.Textarea}
                readOnly={readOnly}
              />
            </Stack>
          </GroupContainer>

          {readOnly !== true && (
            <Box py={3} textAlign="right">
              <Button
                mt="3"
                colorScheme="blue"
                isLoading={isLoading || isSubmitting}
                type="submit"
              >
                Enviar
              </Button>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};
