import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';

import './index.css';
import AppRouter from './routes/AppRouter';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
