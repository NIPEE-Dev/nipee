/**
 * Dependencies.
 */

import update from 'immutability-helper';
import { Jobs } from '../api';
import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';

/**
 * Action Types.
 */

export const actionTypes = createActionTypes('jobs', [
  'CALL_CANDIDATES',
  'CALL_CANDIDATES_PENDING',
  'CALL_CANDIDATES_FULFILLED',
  'CALL_CANDIDATES_REJECTED',

  'UPDATE_CANDIDATE_JOB_STATUS',
  'UPDATE_CANDIDATE_JOB_STATUS_PENDING',
  'UPDATE_CANDIDATE_JOB_STATUS_FULFILLED',
  'UPDATE_CANDIDATE_JOB_STATUS_REJECTED'
]);

/**
 * Initial State.
 */

export const initialState = {
  isLoading: false
};

/**
 * Reducer.
 */

export default createReducer(initialState, {
  [actionTypes.UPDATE_CANDIDATE_JOB_STATUS_PENDING](state) {
    return update(state, {
      isLoading: { $set: true }
    });
  },
  [actionTypes.UPDATE_CANDIDATE_JOB_STATUS_FULFILLED](state) {
    return update(state, {
      isLoading: { $set: false }
    });
  },
  [actionTypes.UPDATE_CANDIDATE_JOB_STATUS_REJECTED](state) {
    return update(state, {
      isLoading: { $set: false }
    });
  }
});

/**
 * Action Creators.
 */

export const handleCallCandidates =
  ({ jobs, candidates }) =>
  (dispatch) =>
    dispatch({
      type: actionTypes.CALL_CANDIDATES,
      payload: Jobs.callCandidates({ jobs, candidates })
    });

export const handleCandidateJobUpdate = (data) => (dispatch) =>
  dispatch({
    type: actionTypes.UPDATE_CANDIDATE_JOB_STATUS,
    payload: Jobs.changeStatus(data)
  });

/**
 * Selectors
 */

export const isLoading = (state) => state.jobs.isLoading;
