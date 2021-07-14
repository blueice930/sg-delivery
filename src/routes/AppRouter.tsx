import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Routes from './Routes';
import Home from '../pages/Home';
import About from '../pages/About';
import User from '../pages/private/User';
import Navbar from '../components/Navbar';
import '../App.css';
import Shop from '../pages/Shop';
import PageNotFound from '../pages/404';
import PrivateRoute from './PrivateRoute';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';


const AppRouter: FC = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route
            exact
            path={Routes.root}
            component={Home}
          />
          <Route
            exact
            path={Routes.shop}
            component={Shop}
          />
          <Route
            exact
            path={Routes.about}
            component={About}
          />
          <Route
            exact
            path={Routes.login}
            component={Login}
          />
          <PrivateRoute
            exact
            component={User}
          />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default AppRouter;
