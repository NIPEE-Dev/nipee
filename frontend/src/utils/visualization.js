import moment from 'moment';

export const moneyFormatter = (value) => {
  const formatter = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  });

  return formatter.format(value);
};

export const dateFormatter = (
  data,
  format = 'DD/MM/YYYY',
  parseFormat = 'YYYY-MM-DD'
) => {
  const date = moment(data, parseFormat).format(format);

  return date !== 'Invalid date' ? date : '-';
};
