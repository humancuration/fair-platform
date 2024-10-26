// frontend/src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { StateProvider } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';


ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
