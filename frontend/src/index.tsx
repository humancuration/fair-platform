// frontend/src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './modulesf/store/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
