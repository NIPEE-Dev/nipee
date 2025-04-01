/**
 * Dependencies.
 */

import update from 'immutability-helper';
import { Contracts } from '../api';
import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';

/**
 * Action Types.
 */

export const actionTypes = createActionTypes('contracts', [
  'FETCH_CONTRACT_DATA',
  'FETCH_CONTRACT_DATA_PENDING',
  'FETCH_CONTRACT_DATA_FULFILLED',
  'FETCH_CONTRACT_DATA_REJECTED',
]);

/**
 * Initial State.
 */

export const initialState = {
  isLoading: false,
  records: null,
};

/**
 * Reducer.
 */

export default createReducer(initialState, {
  [actionTypes.FETCH_CONTRACT_DATA_PENDING](state) {
    return update(state, {
      isLoading: { $set: true },
    });
  },
  [actionTypes.FETCH_CONTRACT_DATA_FULFILLED](
    state,
    {
      payload: {
        data: { data },
      },
    }
  ) {
    return update(state, {
      isLoading: { $set: false },
      records: { $set: data },
    });
  },
  [actionTypes.FETCH_CONTRACT_DATA_REJECTED](state) {
    return update(state, {
      isLoading: { $set: false },
    });
  },
});

/**
 * Action Creators.
 */

export const fetchContractData =
  ({ job, candidate }) =>
  (dispatch) =>
    dispatch({
      type: actionTypes.FETCH_CONTRACT_DATA,
      payload: Contracts.fetchContractData({ job, candidate }),
    });

/**
 * Selectors
 */

export const isLoading = (state) => state.contracts.isLoading;

export const records = (state) => state.contracts.records;
