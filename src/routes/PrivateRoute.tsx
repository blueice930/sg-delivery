import { FC } from "react";
import { Redirect, Route } from "react-router";
import { RouteProps } from "react-router-dom";
import Routes from "./Routes";

export interface PrivateRouteProps {
  component: JSX.Element;
}

const PrivateRoute = ({component, ...props}: PrivateRouteProps | RouteProps) => {
  let isAuthed = true

  return (<Route
    {...props}
    render={({location}) => isAuthed ? (
      component
    ) : (
      <Redirect to={{pathname: Routes.login, state: {from: location}}} />
    )}
  />)
}

export default PrivateRoute;
