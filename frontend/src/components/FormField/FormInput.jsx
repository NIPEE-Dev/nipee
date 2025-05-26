import React from 'react';
import { Input } from '@chakra-ui/react';

const FormInput = ({ placeholder, type, field, ...props }) => {
  const value = field.value || '';
  return <Input id={field.name} {...field} type={type} value={value} {...props} />;
};
export default FormInput;
