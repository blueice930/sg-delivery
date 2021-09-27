import React from 'react';
import styled from 'styled-components';
import { themeColor } from '../theme';

const StyledFooter = styled.div`
  background-color: ${themeColor.dark};
  padding: 40px 20px;
  color: ${themeColor.white};
`;

const HomeFooter = () => (
  <StyledFooter>
    Footer
  </StyledFooter>
);

export default HomeFooter;
