import {
  resetSilently as logout,
  setLoginRedirect
} from '../../store/ducks/auth';
import { deleteCookie } from '../utils/cookie';

export default function authExceptionMiddleware(store) {
  return (next) => (action) => {
    if (!action.payload) {
      return next(action);
    }

    let result = next(action);

    if (
      action.payload.response &&
      action.payload.response.data &&
      action.payload.response.data.message &&
      action.payload.response.data.message.indexOf('Unauthenticated') !== -1
    ) {
      deleteCookie('data');
      localStorage.removeItem('logged');
      store.dispatch(logout('Sessão expirada'));
      store.dispatch(setLoginRedirect(window.location.pathname));
    }

    return result;
  };
}
