import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../logo.svg';
import Routes from '../routes/Routes';

const StyledLogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled.img`
  width: 50px;
`;

const StyledLink = styled(Link)`
  color: white;
`

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 10vh;
  background-color: #5c5c5c;
  color: #FFF;
  ul {
    list-style: none;
    width: 50%;
    justify-content: space-around;
    display: flex;
    align-items: center;
  }
`;

const Navbar = () => {
  return (
    <StyledNavbar>
      <StyledLogoLink to={Routes.root}>
        <StyledLogo src={logo} alt="Logo" />
      </StyledLogoLink>
      <ul>
        <StyledLink to={Routes.shop}>
          <li>Shop</li>
        </StyledLink>
        <StyledLink to={Routes.about}>
          <li>About</li>
        </StyledLink>
        <StyledLink to={Routes.user}>
          <FontAwesomeIcon icon={faUser} />
        </StyledLink>
      </ul>
    </StyledNavbar>
  )
}

export default Navbar;
