import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import moment from 'moment/min/moment-with-locales';
import App from './components/App/App';
import configureStore, { history } from './configureStore';
import theme from './theme';

const initialState = {};
const store = configureStore(initialState);

moment.locale('pt-br');

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ReduxRouter history={history} store={store}>
          <App />
        </ReduxRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
