import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import _sortBy from 'lodash/sortBy';
import {
  Accordion,
  Box,
  Button,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  UnorderedList
} from '@chakra-ui/react';
import { IoMdEye } from 'react-icons/all';
import Card from '../../components/Card/Card';
import { moneyFormatter } from '../../utils/visualization';
import { WithModal } from '../../components/WithModal';
import { ModalConfirm } from '../../components/WithModal/ModalConfirm';
import FinancialDetailsForm from './FinancialDetailsForm';
import EmptyResult from '../../components/EmptyResult/EmptyResult';
import PermissionAction from '../../components/Permission/PermissionAction';

export const FinancialDraftForm = ({ readOnly, isLoading, ...props }) => {
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setTotalValue(props.detailedRecord.total);
  }, [props.detailedRecord.total]);

  const buildActionButton = () => {
    if (readOnly !== true && props.detailedRecord.status === '1') {
      return (
        <Box py={3} textAlign='right'>
          <Tooltip
            hasArrow
            placement='left'
            label='Este fechamento já foi faturado.'
            shouldWrapChildren
            mt='3'
          >
            <Button isDisabled>Enviar</Button>
          </Tooltip>
        </Box>
      );
    } else if (readOnly !== true && props.detailedRecord.status === '0') {
      return (
        <Box py={3} textAlign='right'>
          <WithModal
            modal={({ closeModal }) => (
              <ModalConfirm
                text='Essa ação irá efetuar o faturamento e gerar os boletos. Após isso nada poderá ser editado ou desfeito.'
                onConfirm={() => {
                  props.onSubmit({ status: 1 });
                  closeModal();
                }}
                onCancel={closeModal}
              />
            )}
          >
            {({ toggleModal }) => (
              <Button
                mt='3'
                colorScheme='blue'
                isLoading={isLoading}
                onClick={toggleModal}
              >
                Faturar
              </Button>
            )}
          </WithModal>
        </Box>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Formik
      enableReinitialize
      initialErrors={props.initialErrors}
      initialValues={props.initialValues}
      onSubmit={(values) => {
        if (props.detailedRecord.status === '1') {
          return;
        }

        props.onSubmit(values);
      }}
    >
      <Form>
        <SimpleGrid columns={4} spacing={5}>
          <Card>
            <Stat>
              <StatLabel>Valor total</StatLabel>
              <StatNumber>{moneyFormatter(totalValue)}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type='increase' />
                23.36%
              </StatHelpText> */}
            </Stat>
          </Card>

          <PermissionAction
            permissions={[
              'financial-close.commission-all',
              'financial-close.commission-me'
            ]}
          >
            <Card>
              <Stat>
                <StatLabel>Comissão</StatLabel>
                <StatNumber>
                  {moneyFormatter(props.detailedRecord.commissions.total)}
                  <WithModal
                    modal={
                      <UnorderedList>
                        {props.detailedRecord.commissions.rows.map((row) => (
                          <ListItem>
                            {row.name}: {moneyFormatter(row.value)}
                          </ListItem>
                        ))}

                        {props.detailedRecord.commissions.rows.length === 0 && (
                          <EmptyResult />
                        )}
                      </UnorderedList>
                    }
                  >
                    {({ toggleModal }) => (
                      <Button
                        ml={3}
                        size='xs'
                        onClick={toggleModal}
                        colorScheme='teal'
                      >
                        <IoMdEye />
                      </Button>
                    )}
                  </WithModal>
                </StatNumber>
              </Stat>
            </Card>
          </PermissionAction>

          <Card>
            <Stat>
              <StatLabel>Empresas</StatLabel>
              <StatNumber>{props.detailedRecord.companies.length}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type='decrease' />
                5.22%
              </StatHelpText> */}
            </Stat>
          </Card>
          <Card>
            <Stat>
              <StatLabel>Cobranças</StatLabel>
              <StatNumber>{props.detailedRecord.candidates_count}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type='increase' />
                12.67%
              </StatHelpText> */}
            </Stat>
          </Card>
        </SimpleGrid>
        <Accordion defaultIndex={[0]} allowMultiple>
          {_sortBy(
            props.detailedRecord.companies,
            (c) => c.company.corporate_name
          ).map((company) => (
            <Card mt={5}>
              <FinancialDetailsForm
                canEditRowValue={props.detailedRecord.status !== '1'}
                key={company.id}
                company={company}
                readOnly={readOnly}
                setTotalValue={setTotalValue}
                updateDetails={props.updateDetails}
                id={props.detailedRecord.id}
                commissions={props.detailedRecord.commissions.companies}
              />
            </Card>
          ))}
        </Accordion>

        {buildActionButton()}
      </Form>
    </Formik>
  );
};
