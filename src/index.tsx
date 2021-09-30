import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ItemsProvider } from './contexts/ItemContext';
import { OrdersProvider } from './contexts/OrderContext';

import './index.css';
import AppRouter from './routes/AppRouter';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ItemsProvider>
          <OrdersProvider>
            <AppRouter />
          </OrdersProvider>
        </ItemsProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
