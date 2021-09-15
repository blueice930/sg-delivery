import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  faBox, faUser, faShoppingCart, faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, makeStyles, Theme } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

import { useAuth } from 'src/contexts/AuthContext';
import logo from 'src/assets/logo.svg';
import Routes from 'src/routes/Routes';
import { theme } from 'src/theme';

const StyledLogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const StyledLogo = styled.img`
  width: 50px;
`;

const StyledLink = styled(Link)`
  color: ${theme.white};
  text-decoration: none;
  display: flex;
  align-items: center;
`;

export const StyledIcon = styled(FontAwesomeIcon)`
  margin: 5px;
`;

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 10vh;
  background-color: ${theme.dark};
  color: ${theme.white};
  ul {
    list-style: none;
    width: 50%;
    justify-content: space-around;
    display: flex;
    align-items: center;
  }
`;

const StyledLogoTxt = styled.div`
  text-decoration: none;
  color: ${theme.atomBlue};
  font-size: 18px;
  border: 1px solid currentColor;
  box-shadow: 0 0 5px currentColor;
  border-radius: 4px;
  padding: 5px 10px;
  text-shadow: 0 0 5px currentColor;
`;

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: muiTheme.spacing(1),
    },
  },
  orange: {
    color: muiTheme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { currUser } = useAuth();

  return (
    <StyledNavbar>
      <StyledLogoLink to={Routes.root}>
        <StyledLogo src={logo} alt="Logo" />
        <StyledLogoTxt>SG Delivery</StyledLogoTxt>
      </StyledLogoLink>
      <ul>
        <StyledLink to={Routes.shop}>
          <StyledIcon icon={faShoppingCart} />
          <li>Shop</li>
        </StyledLink>
        <StyledLink to={Routes.about}>
          <StyledIcon icon={faPhoneAlt} />
          <li>Contact Us</li>
        </StyledLink>
        <StyledLink to={Routes.item}>
          <StyledIcon icon={faBox} />
          <li>My Packages</li>
        </StyledLink>
        <StyledLink to={Routes.order}>
          <StyledIcon icon={faBox} />
          <li>My Delivery</li>
        </StyledLink>
        <StyledLink to={Routes.user}>
          <StyledIcon icon={faUser} />
          <div className="username">
            {currUser ? currUser.displayName : 'Log in'}
          </div>
        </StyledLink>
        {currUser && (
          <StyledLink to={Routes.user}>
            <Avatar className={classes.orange}>
              {(currUser.fname && currUser.lname && `${currUser.fname[0]}${currUser.lname[0]}`) || 'A'}
            </Avatar>
          </StyledLink>
        )}
      </ul>
    </StyledNavbar>
  );
};

export default Navbar;
