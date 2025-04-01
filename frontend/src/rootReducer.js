import { combineReducers } from 'redux';
import { createRouterReducer } from '@lagunovsky/redux-react-router';

import auth from './store/ducks/auth';
import resources from './store/ducks/resources';
import jobs from './store/ducks/jobs';
import contracts from './store/ducks/contracts';

export default (history) =>
  combineReducers({
    router: createRouterReducer(history),

    auth,
    resources,
    jobs,
    contracts,
  });
