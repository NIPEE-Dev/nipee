import React, { useState, useCallback } from 'react';
import { FastField } from 'formik';
import {
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Box,
  useToast
} from '@chakra-ui/react';

import FormField from '../../components/FormField/FormField';
import { cepMask } from '../../utils/formHelpers';
import { cepValidator } from '../../utils/formValidators';

const AddressFields = ({
  readOnly = false,
  setFieldValue,
  relation = 'address',
  required = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCepSelected, setIsCepSelected] = useState(false);
  const toast = useToast();

  const triggerFindCepFail = () => {
    toast({
      description: 'Não foi possível encontrar este Código Postal',
      status: 'warning',
      isClosable: true,
      position: 'top',
      variant: 'left-accent'
    });
  };

  const searchAddress = useCallback(
    (cep) => {
      const cepNumbers = cep.replace(/\D/g, '');
      if (cepNumbers.length === 7) {
        setIsLoading(true);
        setIsCepSelected(true);
        fetch(`https://api.duminio.com/ptcp/v2/ptapi67cf743eba11e8.10231284/${cepNumbers}`)
          .then((res) => res.json())
          .then((response) => {
            if (!response || response.error) {
              triggerFindCepFail();
            } else {
              const districtFull = response[0]?.Distrito || '';
              setFieldValue(`${relation}.uf`, districtFull); // full name, not code
              setFieldValue(
                `${relation}.city`,
                response[0]?.Localidade
                  ? response[0].Localidade.charAt(0).toUpperCase() +
                    response[0].Localidade.slice(1).toLowerCase()
                  : ''
              );
              setFieldValue(`${relation}.address`, response[0]?.Morada || '');
              setFieldValue(`${relation}.district`, response[0]?.Concelho || '');
            }
            setIsLoading(false);
          })
          .catch(() => {
            triggerFindCepFail();
            setIsLoading(false);
          });
      }
    },
    [setFieldValue, relation]
  );

  return (
    <>
      <Stack direction={['column', 'row']} spacing="24px">
        <InputGroup flex="1">
          <FastField
            id={`${relation}.cep`}
            name={`${relation}.cep`}
            validate={(value) => cepValidator(value, required)}
            component={FormField.InputMask}
            mask={cepMask}
            placeholder="Código Postal"
            readOnly={readOnly}
            required={required}
            onBlur={(e) => searchAddress(e.target.value)}
            width="100%"
          />
          {isLoading && (
            <InputRightElement pointerEvents="none">
              <Spinner size="sm" />
            </InputRightElement>
          )}
        </InputGroup>

        <Box flex="1">
          <FastField
            id={`${relation}.uf`}
            name={`${relation}.uf`}
            placeholder="Distrito"
            component={FormField}
            readOnly={true} // always read-only
            required={required}
            width="100%"
          />
        </Box>
      </Stack>

      <Stack direction={['column', 'row']} spacing="24px">
        <Box flex="1">
          <FastField
            id={`${relation}.city`}
            name={`${relation}.city`}
            placeholder="Localidade"
            component={FormField}
            readOnly={isCepSelected || readOnly}
            required={required}
            width="100%"
          />
        </Box>

        <Box flex="1">
          <FastField
            id={`${relation}.district`}
            name={`${relation}.district`}
            placeholder="Concelho"
            component={FormField}
            readOnly={isCepSelected || readOnly}
            required={required}
            width="100%"
          />
        </Box>
      </Stack>

      <Stack direction={['column', 'row']} spacing="24px">
        <Box flex="1">
          <FastField
            id={`${relation}.address`}
            name={`${relation}.address`}
            placeholder="Morada"
            component={FormField}
            readOnly={isCepSelected || readOnly}
            required={required}
            width="100%"
          />
        </Box>

        <Box flex="1">
          <FastField
            id={`${relation}.number`}
            name={`${relation}.number`}
            placeholder="Número"
            component={FormField}
            readOnly={readOnly}
            required={required}
            width="100%"
          />
        </Box>
      </Stack>

      <Stack direction={['column', 'row']} spacing="24px">
        <Box flex="1">
          <FastField
            id={`${relation}.complement`}
            name={`${relation}.complement`}
            placeholder="Andar"
            component={FormField}
            readOnly={readOnly}
            width="100%"
          />
        </Box>
      </Stack>
    </>
  );
};

export default AddressFields;
