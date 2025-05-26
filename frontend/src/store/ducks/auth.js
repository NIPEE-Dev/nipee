/**
 * Dependencies.
 */

import update from 'immutability-helper';
import { Auth } from '../api';
import { history } from '../../configureStore';
import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';

/**
 * Action Types.
 */

export const actionTypes = createActionTypes('auth', [
  'LOGIN',
  'LOGIN_PENDING',
  'LOGIN_FULFILLED',
  'LOGIN_REJECTED',

  'LOGOUT',
  'LOGOUT_PENDING',
  'LOGOUT_FULFILLED',
  'LOGOUT_REJECTED',

  'PING',
  'PING_PENDING',
  'PING_FULFILLED',
  'PING_REJECTED',

  'SYNC_PERMISSIONS',
  'RESET',
  'LOGIN_REDIRECT'
]);

/**
 * Initial State.
 */

export const initialState = {
  isLoading: false,
  loggingOut: true,
  profile: {},
  username: '',
  role: '',
  ping: false,
  isPinging: false,
  authError: null,
  permissions: [],
  loginRedirect: false
};

/**
 * Reducer.
 */

export default createReducer(initialState, {
  [actionTypes.LOGIN_PENDING](state) {
    return update(state, {
      isLoading: { $set: true }
    });
  },
  [actionTypes.LOGIN_FULFILLED](
    state,
    {
      payload: {
        data: { permissions, username, role, user_id, candidate_id = null }
      }
    }
  ) {
    localStorage.setItem('logged', 1);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    localStorage.setItem(
      'profile',
      JSON.stringify({ username, role, user_id, 
        ...(candidate_id != null && { candidate_id })
       })
    );
    return update(state, {
      isLoading: { $set: false },
      authError: { $set: null },
      ping: { $set: true },
      permissions: { $set: permissions },
      username: { $set: username },
      role: { $set: role }
    });
  },
  [actionTypes.LOGIN_REJECTED](state, { payload }) {
    return update(state, {
      isLoading: { $set: false },
      authError: {
        $set: payload.response?.data?.error || 'Falha na autenticação'
      }
    });
  },

  [actionTypes.LOGOUT_PENDING](state) {
    return update(state, {
      isLoading: { $set: true }
    });
  },

  [actionTypes.LOGOUT_FULFILLED](state) {
    return update(state, {
      isLoading: { $set: false },
      expiresIn: { $set: 0 }
    });
  },

  [actionTypes.LOGOUT_REJECTED](state) {
    return update(state, {
      isLoading: { $set: false }
    });
  },

  [actionTypes.PING_PENDING](state) {
    return update(state, {
      isPinging: { $set: true }
    });
  },

  [actionTypes.PING_FULFILLED](state) {
    return update(state, {
      isPinging: { $set: false }
    });
  },

  [actionTypes.PING_REJECTED](state) {
    return update(state, {
      isPinging: { $set: false }
    });
  },

  // essa action type vai passar no middleware resetReduxMiddleware e fazer o que precisa ser feito
  [actionTypes.RESET](state, { meta: { message } }) {
    if (!message) {
      return state;
    }

    return update(state, {
      authError: { $set: message }
    });
  },

  [actionTypes.LOGIN_REDIRECT](state, { meta: { loginRedirect } }) {
    return update(state, {
      loginRedirect: { $set: loginRedirect }
    });
  },

  [actionTypes.SYNC_PERMISSIONS](state) {
    const permissions = localStorage.getItem('permissions');
    let profile = localStorage.getItem('profile');
    profile = profile ? JSON.parse(profile) : {};

    return update(state, {
      permissions: { $set: permissions ? JSON.parse(permissions) : [] },
      username: { $set: profile.username },
      role: { $set: profile.role },
      profile: { $set: profile }
    });
  }
});

/**
 * Action Creators.
 */

export const resetSilently = (message) => ({
  type: actionTypes.RESET,
  meta: {
    message
  }
});

export const handleLogin = (email, password) => (dispatch, getState) => {
  dispatch(resetSilently());

  return dispatch({
    type: actionTypes.LOGIN,
    payload: Auth.login(email, password)
  }).then(() => {
    const userProfile = JSON.parse(localStorage.getItem('profile'));
    const userRole = userProfile?.role || '';

    let redirectPath = '/insurance-settings';
    if (userRole === "Empresa") redirectPath = '/dashboard-companies';
    else if (userRole === "Candidato") redirectPath = `/candidates/view/${userProfile.candidate_id}`;
    else if (userRole === "Escola") redirectPath = '/dashboard-schools';

    history.push(redirectPath);
    
    window.location.reload();
  });
};

export const handlePing = () => (dispatch) =>
  dispatch({
    type: actionTypes.PING,
    payload: Auth.ping()
  });

export const setLoginRedirect = (loginRedirect) => (dispatch) =>
  dispatch({
    type: actionTypes.LOGIN_REDIRECT,
    meta: {
      loginRedirect
    }
  });

export const handleLogoutSilently = () => ({
  type: actionTypes.LOGOUT,
  payload: Auth.logout()
});

export const handleLogout = () => (dispatch) => {
  localStorage.removeItem('logged');
  localStorage.removeItem('permissions');
  localStorage.removeItem('profile');
  localStorage.removeItem('chakra-ui-color-mode');
  window.location.reload();
  return dispatch(handleLogoutSilently());
};

export const syncPermissions = () => (dispatch) =>
  dispatch({
    type: actionTypes.SYNC_PERMISSIONS
  });

/**
 * Selectors.
 */

export const isLoading = (state) => state.auth.isLoading;

export const profile = (state) => state.auth.profile;

export const username = (state) => state.auth.username;

export const role = (state) => state.auth.role;

export const permissions = (state) => state.auth.permissions;

export const isPinging = (state) => state.auth.isPinging;

export const isPinged = (state) => state.auth.ping;

export const authError = (state) => state.auth.authError;

export const isAuthenticated = () => {
  const cookieLogged = localStorage.getItem('logged');
  if (cookieLogged) {
    return true;
  }

  return false;
};
