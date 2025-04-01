import React from 'react';
import { Input } from '@chakra-ui/react';
import InputMask from 'react-input-mask';

const FormInputMask = ({
  placeholder,
  onBlur,
  type,
  field,
  onChange,
  mask,
  maskChar,
  beforeMaskedValueChange
}) => {
  const value = field.value || '';
  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      beforeMaskedValueChange={beforeMaskedValueChange}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      {(inputProps) => (
        <Input id={field.name} {...inputProps} type={type} value={value} />
      )}
    </InputMask>
  );
};

export default FormInputMask;
