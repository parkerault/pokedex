import React from 'react';
import { hydrate, render } from "react-dom";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";
import configureStore from 'config/createStore';

import App from './App';
import { LocalStorageKeys, RootState } from 'config/types';

const history = createBrowserHistory();
const store = configureStore(history);

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"),
);

if (module.hot) {
  module.hot.accept();
}
