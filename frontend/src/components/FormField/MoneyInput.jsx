import React from 'react';
import NumberFormat from 'react-number-format';

const MoneyInput = ({ defaultValue, placeholder, ...props }) => (
  <NumberFormat
    py={2}
    px={4}
    decimalSeparator=','
    allowNegative={false}
    prefix='€ '
    value={defaultValue}
    onValueChange={(e) =>
      props.form?.setFieldValue(props.field.name, e.floatValue)
    }
    decimalScale={2}
    fixedDecimalScale
    isNumericString
    {...props}
  />
);

export default MoneyInput;
