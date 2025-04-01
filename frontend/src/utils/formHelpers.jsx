import React from 'react';
import { HStack } from '@chakra-ui/react';

export const cnpjMask = '999999999';
export const cpfMask = '999.999.999-99';
export const cepMask = '9999-999';
export const phoneMask = '351 999 999 999';

export const beforeMaskedValueChangePhone = (newState) => {
  let { value } = newState;

  const newValue = value.replace(/\D/g, '');
  if (newValue.length === 12) { 
    value = newValue.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{3})$/,
      '$1 $2 $3 $4'
    );
  } else if (newValue.length === 9) { 
    value = `${newValue.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3')}`;
  }

  return {
    ...newState,
    value,
  };
};

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

export const rowSelectionHook = (contentCallback) => (hooks) =>
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps, selectedFlatRows }) => (
        <HStack style={{ width: 0 }}>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          {contentCallback && contentCallback(selectedFlatRows)}
        </HStack>
      ),
      Cell: ({ row }) => (
        <div style={{ width: 0 }}>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      ),
    },
    ...columns,
  ]);

export const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export const getDayByNumber = (number) => {
  if (number === undefined) {
    return '';
  }

  const value = Number(number) - 1;
  return weekDays[value];
};

export const makeJourneyText = (values) =>
  `DE ${getDayByNumber(values.working_day?.start_weekday)} À ${getDayByNumber(
    values.working_day?.end_weekday
  )} DAS ${values.working_day?.start_hour} ÀS ${values.working_day?.end_hour} ${
    values.working_day?.day_off_start_weekday
      ? ` E DE ${getDayByNumber(
          values.working_day.day_off_start_weekday
        )} DAS ${values.working_day.day_off_start_hour} ÀS ${
          values.working_day.day_off_end_hour
        }`
      : ''
  } (COM ${values.working_day?.day_off}) TOTALIZANDO ${
    values.working_day?.working_hours
  } HORAS SEMANAIS`.toUpperCase();
