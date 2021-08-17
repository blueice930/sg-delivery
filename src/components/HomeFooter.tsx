import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const StyledFooter = styled.div`
  background-color: ${theme.dark};
  padding: 40px 20px;
  color: ${theme.white};
`;

const HomeFooter = () => (
  <StyledFooter>
    Footer
  </StyledFooter>
);

export default HomeFooter;
