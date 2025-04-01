import { createStore, compose, applyMiddleware } from 'redux';
import { createRouterMiddleware } from '@lagunovsky/redux-react-router';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { createBrowserHistory } from 'history';
import createRootReducer from './rootReducer';
import resetMiddleware from './store/middlewares/reduxReset';
import authenticatedMiddleware from './store/middlewares/authenticatedMiddleware';
import feedbackMiddleware from './store/middlewares/feedbackMiddleware';

export const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

export default function configureStore(initialState = {}) {
  const logger = createLogger();

  const middlewares =
    import.meta.env.MODE === 'production'
      ? [
          thunk,
          promiseMiddleware,
          authenticatedMiddleware,
          feedbackMiddleware,
          routerMiddleware,
        ]
      : [
          thunk,
          promiseMiddleware,
          authenticatedMiddleware,
          feedbackMiddleware,
          logger,
          routerMiddleware,
        ];

  const enhancers = [
    applyMiddleware(...middlewares),
    resetMiddleware('auth/RESET'),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    // eslint-disable-next-line prettier/prettier
    import.meta.env.MODE !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
          // Prevent recomputing reducers for `replaceReducer`
          shouldHotReload: false,
        })
      : compose;

  return createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(...enhancers)
  );
}
