/**
 * Dependencies.
 */

import updateObj from 'immutability-helper';
import objectPath from 'object-path';
import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';
import resolve from '../../utils/resolve';

/**
 * Action Types.
 */

const actionTypes = createActionTypes('resources', [
  'FETCH_LIST',
  'FETCH_LIST_PENDING',
  'FETCH_LIST_FULFILLED',
  'FETCH_LIST_REJECTED',

  'DETAILS',
  'DETAILS_PENDING',
  'DETAILS_FULFILLED',
  'DETAILS_REJECTED',

  'CREATE',
  'CREATE_PENDING',
  'CREATE_FULFILLED',
  'CREATE_REJECTED',

  'UPDATE',
  'UPDATE_PENDING',
  'UPDATE_FULFILLED',
  'UPDATE_REJECTED',

  'REMOVE',
  'REMOVE_PENDING',
  'REMOVE_FULFILLED',
  'REMOVE_REJECTED',

  'REGISTER_RESOURCE',
  'UPDATE_RECORDS',
  'UPDATE_DETAILS'
]);

/**
 * Initial State.
 */

const initialState = {
  isLoading: false,
  records: [],
  detailedRecords: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0
  },

  errors: {},

  isSaving: false,
  savedRecord: {},
  savingRecords: [],

  removedRecord: {},
  removingRecords: [],
  isRemoving: false
};

/**
 * Reducer.
 */

export default createReducer(initialState, {
  [actionTypes.REGISTER_RESOURCE](state, { payload: { resource } }) {
    return updateObj(state, {
      [resource]: { $set: initialState }
    });
  },

  [actionTypes.UPDATE_RECORDS](
    state,
    { payload: { records }, meta: { resource } }
  ) {
    return updateObj(state, {
      [resource]: {
        records: { $set: records }
      }
    });
  },

  [actionTypes.FETCH_LIST_PENDING](state, { meta: { resource } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: true },
        errors: { $set: {} }
      }
    });
  },
  [actionTypes.FETCH_LIST_FULFILLED](
    state,
    {
      payload: {
        data: { data, meta }
      },
      meta: { resource }
    }
  ) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false },
        records: { $set: data },
        pagination: {
          $set: {
            total: meta?.total,
            current_page: meta?.current_page,
            per_page: meta?.per_page
          }
        }
      }
    });
  },
  [actionTypes.FETCH_LIST_REJECTED](state, { meta: { resource } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false }
      }
    });
  },

  /**
   * Details
   */
  [actionTypes.DETAILS_PENDING](state, { meta: { resource } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: true },
        errors: { $set: {} }
      }
    });
  },
  [actionTypes.DETAILS_FULFILLED](
    state,
    {
      payload: {
        data: { data }
      },
      meta: { resource, id }
    }
  ) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false },
        detailedRecords: {
          [id]: { $set: data }
        }
      }
    });
  },
  [actionTypes.DETAILS_REJECTED](state, { meta: { resource, id } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false },
        detailedRecords: {
          [id]: { $set: {} }
        }
      }
    });
  },

  /**
   * Create
   */
  [actionTypes.CREATE_PENDING](state, { meta: { resource } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: true },
        errors: { $set: {} }
      }
    });
  },

  [actionTypes.CREATE_FULFILLED](
    state,
    {
      payload: {
        data: { data }
      },
      meta: { resource }
    }
  ) {
    if (!data) {
      return updateObj(state, {
        [resource]: {
          isLoading: { $set: false }
        }
      });
    }

    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false },
        records: { $unshift: [data] },
        detailedRecords: { [data.id]: { $set: data } }
      }
    });
  },

  [actionTypes.CREATE_REJECTED](state, { payload, meta: { resource } }) {
    return updateObj(state, {
      [resource]: {
        isLoading: { $set: false },
        errors: { $set: objectPath.get(payload, `response.data.errors`, []) }
      }
    });
  },

  /**
   * Update.
   */

  [actionTypes.UPDATE_DETAILS](
    state,
    { payload: data, meta: { resource, id } }
  ) {
    return updateObj(state, {
      [resource]: {
        detailedRecords: { [id]: { $set: data } },
        records: {
          $apply: (records) =>
            records.map((r) => {
              if (r.id === data.id) {
                return data;
              }

              return r;
            })
        }
      }
    });
  },

  [actionTypes.UPDATE_PENDING](state, { meta: { resource, id } }) {
    return updateObj(state, {
      [resource]: {
        isSaving: { $set: true },
        savingRecords: { $push: [id] },
        errors: { $set: {} }
      }
    });
  },

  [actionTypes.UPDATE_FULFILLED](
    state,
    {
      payload: {
        data: { data }
      },
      meta: { resource, id }
    }
  ) {
    return updateObj(state, {
      [resource]: {
        savingRecords: {
          $apply: (records) => records.filter((r) => r !== id)
        },
        isSaving: { $set: false },
        detailedRecords: { [data.id]: { $set: data } },
        records: {
          $apply: (records) =>
            records.map((r) => {
              if (r.id === data.id) {
                return data;
              }
              return r;
            })
        }
      }
    });
  },

  [actionTypes.UPDATE_REJECTED](state, { payload, meta: { resource, id } }) {
    return updateObj(state, {
      [resource]: {
        savingRecords: {
          $apply: (records) => records.filter((r) => r !== id)
        },
        isSaving: { $set: false },
        errors: { $set: objectPath.get(payload, `response.data.errors`, []) }
      }
    });
  },

  /**
   * Remove.
   */

  [actionTypes.REMOVE_PENDING](state, { meta: { resource, id } }) {
    return updateObj(state, {
      [resource]: {
        removingRecords: { $push: [id] },
        isRemoving: { $set: true }
      }
    });
  },

  [actionTypes.REMOVE_FULFILLED](
    state,
    { payload: { data }, meta: { resource, id, preserveRow } }
  ) {
    return updateObj(state, {
      [resource]: {
        removingRecords: {
          $apply: (records) => records.filter((r) => r !== id)
        },
        records: {
          $apply: (records) =>
            preserveRow
              ? records.map((r) => {
                  if (r.id === data.data.id) {
                    return data.data;
                  }
                  return r;
                })
              : records.filter((r) => r.id !== id)
        },
        isRemoving: { $set: false },
        removedRecord: { $set: { data } }
      }
    });
  },

  [actionTypes.REMOVE_REJECTED](state, { meta: { resource, id } }) {
    return updateObj(state, {
      [resource]: {
        removingRecords: {
          $apply: (records) => records.filter((r) => r !== id)
        },
        isRemoving: { $set: false }
      }
    });
  }
});

/**
 * Action Creators.
 */

export const registerResource = (resource) => (dispatch, getState) => {
  const state = getState();
  if (state.resources.hasOwnProperty(resource)) {
    return;
  }

  return dispatch({
    type: actionTypes.REGISTER_RESOURCE,
    payload: { resource }
  });
};

export const fetchList = (config, params) => (dispatch) =>
  dispatch({
    type: actionTypes.FETCH_LIST,
    payload: config.api(params),
    meta: {
      resource: config.resource
    }
  });

export const details = (config, id, params) => ({
  type: actionTypes.DETAILS,
  payload: config.api(id, params),
  meta: {
    resource: config.resource,
    id
  }
});

export const create = (config, data, params) => (dispatch) =>
  dispatch({
    type: actionTypes.CREATE,
    payload: config.api(data, params),
    meta: {
      resource: config.resource
    }
  });

export const update = (config, id, data, params) => (dispatch) =>
  dispatch({
    type: actionTypes.UPDATE,
    payload: config.api(id, data, params),
    meta: {
      resource: config.resource,
      id
    }
  });

export const remove = (config, id, params) => (dispatch) =>
  dispatch({
    type: actionTypes.REMOVE,
    payload: config.api(id, params),
    meta: {
      resource: config.resource,
      id,
      ...(params?.preserveRow && { preserveRow: true })
    }
  });

export const setRecords = (config, records) => (dispatch, getState) =>
  dispatch({
    type: actionTypes.UPDATE_RECORDS,
    payload: {
      records: resolve(records, getRecords(getState(), config.resource))
    },
    meta: {
      resource: config.resource
    }
  });

export const updateDetails = (config, id, data) => (dispatch, getState) =>
  dispatch({
    type: actionTypes.UPDATE_DETAILS,
    payload: resolve(data, getDetailedRecord(getState(), config.resource, id)),
    meta: {
      resource: config.resource,
      id
    }
  });

/**
 * Selectors.
 */

export const isLoading = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isLoading`, false);

export const getRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.records`, []);

export const getDetailedRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.detailedRecords`, []);

export const getDetailedRecord = (state, resource, id) =>
  getDetailedRecords(state, resource)[id] || {};

export const getRemovingRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.removingRecords`, []);

export const isRemoving = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isRemoving`, false);

export const getRemovedRecord = (state, resource) =>
  objectPath.get(state.resources, `${resource}.removedRecord`, {});

export const getErrors = (state, resource) =>
  objectPath.get(state.resources, `${resource}.errors`, {});

export const getPagination = (state, resource) =>
  objectPath.get(state.resources, `${resource}.pagination`, {
    current_page: 1,
    per_page: 10,
    total: 0
  });

export const isSaving = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isSaving`, false);

export const getSavingRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.savingRecords`, []);

export const getSavingRecord = (state, resource) =>
  objectPath.get(state.resources, `${resource}.savingRecord`, {});
