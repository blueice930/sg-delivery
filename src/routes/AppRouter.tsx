import React, { FC } from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';

import { useAuth } from 'src/contexts/AuthContext';
import AdminPage from 'src/pages/Admin';
import Order from 'src/pages/private/Order';
import Routes from './Routes';
import Home from '../pages/Home';
import About from '../pages/About';
import User from '../pages/private/User';
import Item from '../pages/private/Item';
import Navbar from '../components/Navbar';
import '../App.css';
import Shop from '../pages/Shop';
import PageNotFound from '../pages/404';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import AdminRoute from './AdminRoute';

const AppRouter: FC = () => {
  const { currUser } = useAuth();
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
            render={() => (currUser
              ? (
                <Redirect to={{ pathname: Routes.user }} />
              ) : <Login />)}
          />
          <PrivateRoute
            exact
            path={Routes.user}
            component={User}
          />
          <PrivateRoute
            exact
            path={Routes.item}
            component={Item}
          />
          <PrivateRoute
            exact
            path={Routes.order}
            component={Order}
          />
          <AdminRoute
            exact
            path={Routes.admin}
            component={AdminPage}
          />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
};

export default AppRouter;
