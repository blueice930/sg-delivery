import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from 'src/contexts/AuthContext';
import Routes from './Routes';

export interface PrivateRouteProps {
  component: any;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps | RouteProps) => {
  const { currUser } = useAuth();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (currUser
        ? <Component />
        : <Redirect to={{ pathname: Routes.login, state: { from: location } }} />)}
    />
  );
};

export default PrivateRoute;
