import React, { useState } from 'react';
import { FastField } from 'formik';
import {
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react';
import FormField from '../../components/FormField/FormField';
import { cepMask } from '../../utils/formHelpers';
import { cepValidator } from '../../utils/formValidators';

const AddressFields = ({
  readOnly,
  setFieldValue,
  relation = 'address',
  required = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const districtMap = {
    "Aveiro": "av",
    "Beja": "be",
    "Braga": "br",
    "Bragança": "bg",
    "Castelo Branco": "cb",
    "Coimbra": "co",
    "Évora": "ev",
    "Faro": "fa",
    "Guarda": "gu",
    "Leiria": "le",
    "Lisboa": "li",
    "Portalegre": "po",
    "Porto": "pt",
    "Santarém": "sa",
    "Setúbal": "se",
    "Viana do Castelo": "vc",
    "Vila Real": "vr",
    "Viseu": "vi",
    "Açores": "ac",
    "Madeira": "ma"
  };
  
  const searchAddress = (cep) => {
    const cepNumbers = cep.replace(/\D/g, ''); 
    if (cepNumbers.length === 7) { 
      setIsLoading(true);
      fetch(`https://api.duminio.com/ptcp/v2/ptapi67cf743eba11e8.10231284/${cepNumbers}`)
        .then((response) => response.json())
        .then((response) => {
          if (!response || response.error) { 
            triggerFindCepFail();
          } else {
            const districtFull = response[0]?.Distrito || "";  
            const districtAbbr = districtMap[districtFull] || ""; 
  
            setFieldValue(`${relation}.uf`, districtAbbr);
            setFieldValue(`${relation}.city`, response[0]?.Localidade?.charAt(0).toUpperCase() + response[0]?.Localidade?.slice(1).toLowerCase() || "");  
            setFieldValue(`${relation}.address`, response[0]?.Morada || "");  
            setFieldValue(`${relation}.district`, response[0]?.Concelho || "");  
          }
          setIsLoading(false); 
        })
        .catch((e) => {
          triggerFindCepFail();
          setIsLoading(false);
        });
    }
  };   

  return (
    <>
      <Stack direction={['column', 'row']} spacing='24px'>
        <FastField
          id={`${relation}.cep`}
          name={`${relation}.cep`}
          validate={(value) => cepValidator(value, required)}
          render={({ ...props }) => (
            <InputGroup>
              <FormField.InputMask
                {...props}
                placeholder='Código Postal'
                mask={cepMask}
                readOnly={readOnly}
                required={required}
                onBlur={(e) => searchAddress(e.target.value)}
              />
              <InputRightElement
                marginTop='32px'
                children={isLoading ? <Spinner /> : ''}
              />
            </InputGroup>
          )}
        />

        <FastField
          id={`${relation}.uf`}
          name={`${relation}.uf`}
          placeholder='Distrito'
          component={FormField.Select}
          readOnly={readOnly}
          required={required}
        >
          <option value="">Selecione um distrito</option> 
           <option value="av">Aveiro</option>
            <option value="be">Beja</option>
            <option value="br">Braga</option>
            <option value="bg">Bragança</option>
            <option value="cb">Castelo Branco</option>
            <option value="co">Coimbra</option>
            <option value="ev">Évora</option>
            <option value="fa">Faro</option>
            <option value="gu">Guarda</option>
            <option value="le">Leiria</option>
            <option value="li">Lisboa</option>
            <option value="po">Portalegre</option>
            <option value="pt">Porto</option>
            <option value="sa">Santarém</option>
            <option value="se">Setúbal</option>
            <option value="vc">Viana do Castelo</option>
            <option value="vr">Vila Real</option>
            <option value="vi">Viseu</option>
            <option value="ac">Açores</option>
            <option value="ma">Madeira</option>
        </FastField>
      </Stack>

      <Stack direction={['column', 'row']} spacing='24px'>
        <FastField
          id={`${relation}.city`}
          name={`${relation}.city`}
          placeholder='Localidade'
          component={FormField}
          readOnly={readOnly}
          required={required}
        />

        <FastField
          id={`${relation}.district`}
          name={`${relation}.district`}
          placeholder='Conselho'
          component={FormField}
          readOnly={readOnly}
          required={required}
        />
      </Stack>

      <Stack direction={['column', 'row']} spacing='24px'>
        <FastField
          id={`${relation}.address`}
          name={`${relation}.address`}
          placeholder='Endereço'
          component={FormField}
          readOnly={readOnly}
          required={required}
        />

        <FastField
          id={`${relation}.number`}
          name={`${relation}.number`}
          placeholder='Número'
          component={FormField}
          readOnly={readOnly}
          required={required}
        />
      </Stack>

      <Stack direction={['column', 'row']} spacing='24px'>
        <FastField
          id={`${relation}.complement`}
          name={`${relation}.complement`}
          placeholder='Andar'
          component={FormField}
          readOnly={readOnly}
        />
      </Stack>
    </>
  );
};

export default AddressFields;
