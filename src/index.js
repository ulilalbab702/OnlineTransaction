import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as serviceWorker from './serviceWorker';
import storeConfig from './config/store.config';
import { Provider } from 'react-redux';
import { Container } from './components';
import { BrowserRouter } from 'react-router-dom';
var createHost = require('cross-domain-storage/host');
var storageHost = createHost([
  {
      origin: 'https://utconnect_dev.unitedtractors.com',
      allowedMethods: ['get', 'set', 'remove'],
  },
  {
      origin: 'https://dev-aks.unitedtractors.com:31613',
      allowedMethods: ['get'],
  },
]);

const store = storeConfig()
ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Container>
            </Container>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
