import React, { FC } from 'react';
import {
  Redirect, Route, Switch,
} from 'react-router-dom';

import { useAuth } from 'src/contexts/AuthContext';
import AdminPage from 'src/pages/private/Admin';
import ItemDetail from 'src/pages/private/ItemDetail';
import OrderDetail from 'src/pages/private/OrderDetail';
import Home from 'src/pages/Home';
import About from 'src/pages/About';
import User from 'src/pages/private/User';
import Items from 'src/pages/private/Items';
import Orders from 'src/pages/private/Orders';
import Routes from './Routes';
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
          path={Routes.items}
          component={Items}
        />
        <PrivateRoute
          exact
          path={Routes.orders}
          component={Orders}
        />
        <AdminRoute
          exact
          path={Routes.admin}
          component={AdminPage}
        />
        <PrivateRoute
          exact
          path={Routes.itemDetail}
          component={ItemDetail}
        />
        <PrivateRoute
          exact
          path={Routes.orderDetail}
          component={OrderDetail}
        />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
};

export default AppRouter;
