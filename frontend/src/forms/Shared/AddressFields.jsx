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
  setFieldValue,
  relation = 'address',
  required = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCepSelected, setIsCepSelected] = useState(false);
  const toast = useToast();

  const districtMap = {
    "Aveiro": "av", "Beja": "be", "Braga": "br", "Bragança": "bg",
    "Castelo Branco": "cb", "Coimbra": "co", "Évora": "ev", "Faro": "fa",
    "Guarda": "gu", "Leiria": "le", "Lisboa": "li", "Portalegre": "po",
    "Porto": "pt", "Santarém": "sa", "Setúbal": "se", "Viana do Castelo": "vc",
    "Vila Real": "vr", "Viseu": "vi", "Açores": "ac", "Madeira": "ma"
  };

  const triggerFindCepFail = () => {
    toast({
      description: 'Não foi possível encontrar este Código Postal',
      status: 'warning',
      isClosable: true,
      position: 'top',
      variant: 'left-accent'
    });
  };

  const getDistrictCode = (value) => {
    if (!value) return '';
    const match = Object.entries(districtMap).find(
      ([name, code]) =>
        name.toLowerCase() === value.toLowerCase() ||
        code.toLowerCase() === value.toLowerCase()
    );
    return match ? match[1] : '';
  };

  const searchAddress = useCallback((cep) => {
    const cepNumbers = cep.replace(/\D/g, '');
    if (cepNumbers.length === 7) {
      setIsLoading(true);
      fetch(`https://api.duminio.com/ptcp/v2/ptapi67cf743eba11e8.10231284/${cepNumbers}`)
        .then((res) => res.json())
        .then((response) => {
          if (!response || response.error) {
            triggerFindCepFail();
            setIsCepSelected(false);
          } else {
            const rawDistrict = response[0]?.Distrito || '';
            const districtCode = getDistrictCode(rawDistrict);

            setFieldValue(`${relation}.uf`, districtCode);
            setFieldValue(`${relation}.city`,
              response[0]?.Localidade
                ? response[0].Localidade.charAt(0).toUpperCase() +
                  response[0].Localidade.slice(1).toLowerCase()
                : ''
            );
            setFieldValue(`${relation}.address`, response[0]?.Morada || '');
            setFieldValue(`${relation}.district`, response[0]?.Concelho || '');
            setIsCepSelected(true);
          }
          setIsLoading(false);
        })
        .catch(() => {
          triggerFindCepFail();
          setIsLoading(false);
          setIsCepSelected(false);
        });
    }
  }, [setFieldValue, relation]);

  return (
    <Stack spacing={4}>
      <Stack direction={['column', 'row']} spacing="24px">
        <InputGroup flex="1">
          <FastField
            id={`${relation}.cep`}
            name={`${relation}.cep`}
            validate={(value) => cepValidator(value, required)}
            component={FormField.InputMask}
            mask={cepMask}
            placeholder="Código Postal"
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
            component={FormField.Select}
            disabled={true}
            readOnly={true}
            required={required}
            width="100%"
            validate={(value) => {
              if (!value && required) return 'Campo obrigatório';
              return Object.values(districtMap).includes(value)
                ? undefined
                : 'Distrito inválido';
            }}
          >
            <option value="">Selecione um distrito</option>
            {Object.entries(districtMap).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </FastField>
          {/* Hidden input to submit even though it's disabled */}
          <FastField type="hidden" name={`${relation}.uf`} />
        </Box>
      </Stack>

      <Stack direction={['column', 'row']} spacing="24px">
        <Box flex="1">
          <FastField
            id={`${relation}.city`}
            name={`${relation}.city`}
            placeholder="Localidade"
            component={FormField}
            readOnly={true}
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
            readOnly={true}
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
            readOnly={true}
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
            width="100%"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default AddressFields;
