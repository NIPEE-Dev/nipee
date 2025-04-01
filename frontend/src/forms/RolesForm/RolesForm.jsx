import React, { useState, useEffect } from 'react';
import { FastField, Form, Formik } from 'formik';
import { Button, Stack, Text } from '@chakra-ui/react';
import CheckboxTree from 'react-checkbox-tree';
import {
  FaChevronDown,
  FaChevronRight,
  FaRegCheckSquare,
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaRegSquare
} from 'react-icons/fa';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import FormField from '../../components/FormField/FormField';
import Resource from '../../components/Resource/Resource';

export const RolesForm = ({ typeForm, readOnly, isLoading, ...props }) => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([0]);

  useEffect(() => {
    setChecked(props.initialValues.enabledPermissions);
  }, [props.initialValues.enabledPermissions]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialErrors={props.initialErrors}
        initialValues={props.initialValues}
        onSubmit={(values) =>
          props.onSubmit({ ...values, permissions: checked })
        }
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Stack direction={['column', 'row']} spacing='24px'>
              <FastField
                id='title'
                name='title'
                placeholder='Nome do perfil'
                component={FormField}
                readOnly={readOnly}
                required
              />
            </Stack>

            <Text fontWeight='medium' mb={2} fontSize='md'>
              Permissões
            </Text>

            {typeForm === 'add' ? (
              <Resource
                resource='RolesTree'
                autoFetch
                resourceParams={{ tree: true }}
              >
                {({ records, isLoading }) => (
                  <CheckboxTree
                    nodes={[
                      {
                        value: 0,
                        label: values.title,
                        children: records
                      }
                    ]}
                    checkModel='leaf'
                    showExpandAll
                    showNodeIcon={false}
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checked) => setChecked(checked)}
                    onExpand={(expanded) => setExpanded(expanded)}
                    disabled={isLoading}
                    icons={{
                      check: (
                        <FaRegCheckSquare
                          className='rct-icon rct-icon-uncheck'
                          icon={['fas', 'square']}
                        />
                      ),
                      uncheck: <FaRegSquare />,
                      halfCheck: <FaRegMinusSquare />,
                      expandClose: <FaChevronRight />,
                      expandOpen: <FaChevronDown />,
                      expandAll: <FaRegPlusSquare />,
                      collapseAll: <FaRegMinusSquare />
                    }}
                  />
                )}
              </Resource>
            ) : (
              <CheckboxTree
                nodes={[
                  {
                    value: 0,
                    label: values.title,
                    children: values.tree
                  }
                ]}
                checkModel='all'
                showExpandAll
                showNodeIcon={false}
                checked={checked}
                expanded={expanded}
                onCheck={(checked) => setChecked(checked)}
                onExpand={(expanded) => setExpanded(expanded)}
                icons={{
                  check: (
                    <FaRegCheckSquare
                      className='rct-icon rct-icon-uncheck'
                      icon={['fas', 'square']}
                    />
                  ),
                  uncheck: <FaRegSquare />,
                  halfCheck: <FaRegMinusSquare />,
                  expandClose: <FaChevronRight />,
                  expandOpen: <FaChevronDown />,
                  expandAll: <FaRegPlusSquare />,
                  collapseAll: <FaRegMinusSquare />
                }}
              />
            )}

            {readOnly !== true && (
              <Button
                mt='3'
                type='submit'
                isLoading={isLoading || isSubmitting}
              >
                Enviar
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
