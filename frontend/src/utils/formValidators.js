import moment from 'moment';

export const cnpjValidator = (cnpj, required) => {
  let b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let c = String(cnpj).replace(/[^\d]/g, '');
  if (c.length === 0 && !required) return undefined;
  if (c.length !== 14) return 'CNPJ incompleto';
  if (/0{14}/.test(c)) return 'CNPJ incompleto';

  for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
  if (c[12] != ((n %= 11) < 2 ? 0 : 11 - n)) return 'CNPJ inválido';

  for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
  if (c[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return 'CNPJ inválido';

  return undefined;
};

export const nifValidator = (nipc, required) => {
  const cleanNipc = String(nipc).replace(/\D/g, ''); 

  if (cleanNipc.length === 0 && !required) return undefined; 
  if (cleanNipc.length !== 9) return 'NIF incompleto';
  if (/^0{9}$/.test(cleanNipc)) return 'NIF inválido'; 

  return undefined; 
};

export const cpfValidator = (cpf, required) => {
  if (typeof cpf !== 'string') return 'CPF inválido';
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length === 0 && !required) return undefined;
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return 'CPF incompleto';
  cpf = cpf.split('').map((el) => +el);
  const rest = (count) =>
    ((cpf
      .slice(0, count - 12)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;
  return rest(10) === cpf[9] && rest(11) === cpf[10]
    ? undefined
    : 'CPF inválido';
};

export const phoneValidator = (phone, required) => {
  const sanitizedPhone = phone ? phone.replace(/\D/g, '') : '';
  if (sanitizedPhone.length === 0 && !required) return undefined;
  return sanitizedPhone.length >= 9 && sanitizedPhone.length <= 12
    ? undefined
    : 'Telemóvel inválido';
};


export const birthDayValidator = (birthDay, required) => {
  const sanitizedBirthDayLength = birthDay
    ? birthDay.replace(/\D/g, '').length
    : 0;

  if (sanitizedBirthDayLength === 0 && !required) {
    return undefined;
  }

  if (!birthDay || sanitizedBirthDayLength !== 8)
    return 'Data de nascimento inválida';

  let formats = ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DDMMYYYY'];
  const date = moment(birthDay, formats);
  return date.isValid() && date.isAfter('1900-01-01', 'year')
    ? undefined
    : 'Data de nascimento inválida';
};

export const cepValidator = (cep, required) => {
  const sanitizedCep = cep ? cep.replace(/\D/g, '') : '';
  if (sanitizedCep.length === 0 && !required) return undefined;
  return sanitizedCep.length === 7 ? undefined : 'Código Postal incompleto';
};
