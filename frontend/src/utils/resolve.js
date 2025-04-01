export default (value, ...rest) =>
  typeof value === 'function' ? value(...rest) : value;
