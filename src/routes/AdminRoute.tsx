import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from 'src/contexts/AuthContext';
import Routes from './Routes';

export interface AdminRouteProps {
  component: any;
}

const AdminRoute = ({ component: Component, ...rest }: AdminRouteProps | RouteProps) => {
  const { currUser } = useAuth();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (currUser?.admin
        ? <Component />
        : <Redirect to={{ pathname: Routes.user, state: { from: location } }} />)}
    />
  );
};

export default AdminRoute;
